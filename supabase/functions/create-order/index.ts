import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';
import { z } from 'https://esm.sh/zod@3.23.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schemas
const orderItemSchema = z.object({
  product_id: z.string().uuid('Invalid product ID format'),
  quantity: z.number().int().positive().max(100, 'Quantity must be between 1-100'),
  price_at_time: z.number().positive('Price must be positive'),
  size: z.string().max(50).optional(),
  color: z.string().max(50).optional(),
});

const payloadSchema = z.object({
  address_id: z.string().uuid('Invalid address ID format'),
  total_amount: z.number().positive('Total amount must be positive').max(10000000, 'Amount exceeds maximum'),
  items: z.array(orderItemSchema).min(1, 'At least one item required').max(50, 'Maximum 50 items'),
});

type CreateOrderPayload = z.infer<typeof payloadSchema>;

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized', code: 'AUTH_001' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Creating order for user:', user.id);

    // Parse and validate request body
    const rawPayload = await req.json();
    const parseResult = payloadSchema.safeParse(rawPayload);
    
    if (!parseResult.success) {
      console.error('Validation failed:', parseResult.error.issues);
      return new Response(
        JSON.stringify({ error: 'Invalid request data', code: 'VALIDATION_001' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { address_id, total_amount, items }: CreateOrderPayload = parseResult.data;

    // Verify address belongs to user
    const { data: address, error: addressError } = await supabaseClient
      .from('addresses')
      .select('*')
      .eq('id', address_id)
      .eq('user_id', user.id)
      .single();

    if (addressError || !address) {
      console.error('Address verification failed:', addressError);
      return new Response(
        JSON.stringify({ error: 'Invalid address', code: 'ADDRESS_001' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Address verified:', address.id);

    // Create order
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user.id,
        address_id: address_id,
        total_amount: total_amount,
        payment_status: 'paid',
        status: 'pending',
        payment_method: 'paystack',
        shipping_address: {
          address_line: address.address_line,
          city: address.city,
          state: address.state,
          postal_code: address.postal_code,
          country: address.country,
        },
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Order creation failed:', orderError);
      return new Response(
        JSON.stringify({ error: 'Failed to create order', code: 'ORDER_001' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order created:', order.id);

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_time: item.price_at_time,
      size: item.size,
      color: item.color,
    }));

    const { error: itemsError } = await supabaseClient
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order items creation failed:', itemsError);
      // Attempt to delete the order if items fail
      await supabaseClient.from('orders').delete().eq('id', order.id);
      return new Response(
        JSON.stringify({ error: 'Failed to create order items', code: 'ORDER_002' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order items created successfully');

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        order_id: order.id,
        status: order.status,
        total_amount: order.total_amount,
        created_at: order.created_at,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', code: 'SERVER_001' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
