import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderItem {
  product_id: string;
  quantity: number;
  price_at_time: number;
  size?: string;
  color?: string;
}

interface CreateOrderPayload {
  address_id: string;
  total_amount: number;
  items: OrderItem[];
}

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
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Creating order for user:', user.id);

    // Parse request body
    const payload: CreateOrderPayload = await req.json();
    const { address_id, total_amount, items } = payload;

    // Validate input
    if (!address_id || !total_amount || !items || items.length === 0) {
      console.error('Invalid payload:', payload);
      return new Response(
        JSON.stringify({ error: 'Missing required fields: address_id, total_amount, or items' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
        JSON.stringify({ error: 'Invalid address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Address verified:', address);

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
        JSON.stringify({ error: 'Failed to create order', details: orderError?.message }),
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
        JSON.stringify({ error: 'Failed to create order items', details: itemsError.message }),
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
