import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from './ImageUpload';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const productSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  price: z.string().min(1, 'Price is required'),
  original_price: z.string().optional(),
  discount: z.string().optional(),
  material: z.string().optional(),
  care: z.string().optional(),
  image_url: z.string().min(1, 'Image is required'),
  sizes: z.array(z.string()).min(1, 'Select at least one size'),
  shipping_fee: z.string().min(1, 'Shipping fee is required'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: any;
}

export const ProductForm = ({ onSuccess, onCancel, initialData }: ProductFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      category: initialData?.category || '',
      subcategory: initialData?.subcategory || '',
      price: initialData?.price?.toString() || '',
      original_price: initialData?.original_price?.toString() || '',
      discount: initialData?.discount?.toString() || '',
      material: initialData?.material || '',
      care: initialData?.care || '',
      image_url: initialData?.image_url || '',
      sizes: initialData?.sizes || [],
      shipping_fee: initialData?.shipping_fee?.toString() || '',
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);

    try {
      const productData = {
        title: data.title,
        description: data.description,
        category: data.category,
        subcategory: data.subcategory || null,
        price: parseFloat(data.price),
        original_price: data.original_price ? parseFloat(data.original_price) : null,
        discount: data.discount ? parseInt(data.discount) : 0,
        material: data.material || null,
        care: data.care || null,
        image_url: data.image_url,
        sizes: data.sizes,
        shipping_fee: parseFloat(data.shipping_fee),
        updated_at: new Date().toISOString(),
      };

      if (initialData?.id) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', initialData.id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Product updated successfully',
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Product created successfully',
        });
      }

      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Image</FormLabel>
              <FormControl>
                <ImageUpload
                  onImageUploaded={field.onChange}
                  currentImage={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Product title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Product description" rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="men">Men</SelectItem>
                    <SelectItem value="women">Women</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subcategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subcategory</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., Shirts, Jeans" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (₦)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" step="0.01" placeholder="0.00" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="original_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Original Price (₦)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" step="0.01" placeholder="0.00" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount %</FormLabel>
                <FormControl>
                  <Input {...field} type="number" placeholder="0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="material"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Material</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., 100% Cotton" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="care"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Care Instructions</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Care instructions" rows={2} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : initialData ? 'Update Product' : 'Create Product'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>

        <FormField
          control={form.control}
          name="sizes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Sizes</FormLabel>
              <div className="flex gap-2 flex-wrap">
                {['S', 'M', 'L', 'XL'].map(size => (
                  <Button
                    key={size}
                    type="button"
                    variant={field.value.includes(size) ? 'default' : 'outline'}
                    onClick={() => {
                      if (field.value.includes(size)) {
                        field.onChange(field.value.filter((s: string) => s !== size));
                      } else {
                        field.onChange([...field.value, size]);
                      }
                    }}
                  >
                    {size}
                  </Button>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shipping_fee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shipping Fee (₦)</FormLabel>
              <FormControl>
                <Input {...field} type="number" min="0" step="1" placeholder="e.g. 24000" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
