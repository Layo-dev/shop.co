import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
type Address = {
  id: string;
  user_id: string;
  address_line: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
};
const profileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email(),
  phone: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional()
});
type ProfileFormValues = z.infer<typeof profileSchema>;
const addressSchema = z.object({
  address_line: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postal_code: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  is_default: z.boolean().optional()
});
type AddressFormValues = z.infer<typeof addressSchema>;
const SettingsPage = () => {
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [lastProfile, setLastProfile] = useState<ProfileFormValues>({
    fullName: "",
    email: "",
    phone: "",
    gender: undefined
  });
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      gender: undefined
    },
    mode: "onSubmit"
  });
  const addressForm = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address_line: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      is_default: false
    },
    mode: "onSubmit"
  });
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth", {
        replace: true
      });
    }
  }, [loading, user, navigate]);
  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const {
        data,
        error
      } = await supabase.from("profiles").select("first_name, last_name, phone, avatar_url, user_id").eq("user_id", user.id).single();
      if (!error) {
        const loaded: ProfileFormValues = {
          fullName: [data?.first_name, data?.last_name].filter(Boolean).join(" "),
          email: user.email || "",
          phone: data?.phone || "",
          gender: undefined
        };
        profileForm.reset(loaded);
        setLastProfile(loaded);
        setAvatarUrl(data?.avatar_url || null);
      }
      setAddressesLoading(true);
      const {
        data: addrRows
      } = await (supabase as any).from("addresses").select("id, user_id, address_line, city, state, postal_code, country, is_default").eq("user_id", user.id).order("created_at", {
        ascending: false
      });
      setAddresses(addrRows as Address[] || []);
      setAddressesLoading(false);
    };
    load();
  }, [user]);
  const saveProfile = async (values: ProfileFormValues) => {
    if (!user) return;
    const [firstName, ...rest] = values.fullName.trim().split(" ");
    const lastName = rest.join(" ");
    const {
      error
    } = await (supabase as any).from("profiles").update({
      first_name: firstName || null,
      last_name: lastName || null,
      phone: values.phone || null,
      gender: values.gender || null
    }).eq("user_id", user.id);
    if (error) {
      toast({
        title: "Failed to save",
        description: "Could not update profile.",
        variant: "destructive"
      });
    } else {
      // Also sync auth user metadata so UI using user.user_metadata stays consistent
      try {
        await supabase.auth.updateUser({
          data: {
            first_name: firstName || "",
            last_name: lastName || "",
            phone: values.phone || "",
            gender: values.gender || ""
          }
        });
      } catch (_) {/* ignore */}
      const saved: ProfileFormValues = {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        gender: values.gender
      };
      setLastProfile(saved);
      toast({
        title: "Saved",
        description: "Profile updated."
      });
      setIsEditing(false);
    }
  };
  const onUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      const {
        error: upErr
      } = await supabase.storage.from("avatars").upload(filePath, file, {
        upsert: true
      });
      if (upErr) throw upErr;
      const {
        data: pub
      } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const url = pub.publicUrl;
      await supabase.from("profiles").update({
        avatar_url: url
      }).eq("user_id", user.id);
      setAvatarUrl(url);
      toast({
        title: "Avatar updated"
      });
    } catch (err) {
      toast({
        title: "Upload failed",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setAvatarUploading(false);
    }
  };
  const openAddAddress = () => {
    setEditingAddress(null);
    addressForm.reset({
      address_line: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      is_default: false
    });
    setAddressDialogOpen(true);
  };
  const openEditAddress = (addr: Address) => {
    setEditingAddress(addr);
    addressForm.reset({
      address_line: addr.address_line,
      city: addr.city,
      state: addr.state,
      postal_code: addr.postal_code,
      country: addr.country,
      is_default: addr.is_default
    });
    setAddressDialogOpen(true);
  };
  const saveAddress = async (values: AddressFormValues) => {
    if (!user) return;
    try {
      if (values.is_default) {
        await (supabase as any).from("addresses").update({
          is_default: false
        }).eq("user_id", user.id);
      }
      if (editingAddress) {
        const {
          error
        } = await (supabase as any).from("addresses").update({
          ...values
        }).eq("id", editingAddress.id).eq("user_id", user.id);
        if (error) throw error;
        toast({
          title: "Address updated"
        });
      } else {
        const {
          error
        } = await (supabase as any).from("addresses").insert([{
          ...values,
          user_id: user.id
        }]);
        if (error) throw error;
        toast({
          title: "Address added"
        });
      }
      const {
        data: addrRows
      } = await (supabase as any).from("addresses").select("id, user_id, address_line, city, state, postal_code, country, is_default").eq("user_id", user.id).order("created_at", {
        ascending: false
      });
      setAddresses(addrRows as Address[] || []);
      setAddressDialogOpen(false);
    } catch (err) {
      toast({
        title: "Save failed",
        description: "Could not save address.",
        variant: "destructive"
      });
    }
  };
  const deleteAddress = async (id: string) => {
    if (!user) return;
    const {
      error
    } = await (supabase as any).from("addresses").delete().eq("id", id).eq("user_id", user.id);
    if (error) {
      toast({
        title: "Delete failed",
        description: "Could not delete address.",
        variant: "destructive"
      });
    } else {
      setAddresses(addresses.filter(a => a.id !== id));
      toast({
        title: "Address deleted"
      });
    }
  };
  const setDefaultAddress = async (id: string) => {
    if (!user) return;
    await (supabase as any).from("addresses").update({
      is_default: false
    }).eq("user_id", user.id);
    await (supabase as any).from("addresses").update({
      is_default: true
    }).eq("id", id).eq("user_id", user.id);
    const {
      data: addrRows
    } = await (supabase as any).from("addresses").select("id, user_id, address_line, city, state, postal_code, country, is_default").eq("user_id", user.id).order("created_at", {
      ascending: false
    });
    setAddresses(addrRows as Address[] || []);
  };
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (!user) {
    return null;
  }
  return <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Manage your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              

              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(saveProfile)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={profileForm.control} name="fullName" render={({
                    field
                  }) => <FormItem className="md:col-span-1">
                          <FormLabel>Full name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} disabled={!isEditing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    <FormField control={profileForm.control} name="email" render={({
                    field
                  }) => <FormItem className="md:col-span-1">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} disabled />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={profileForm.control} name="phone" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Phone number</FormLabel>
                          <FormControl>
                            <Input placeholder="0803 123 4567" {...field} disabled={!isEditing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    <FormField control={profileForm.control} name="gender" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Gender (optional)</FormLabel>
                          <FormControl>
                            <RadioGroup value={field.value ?? ""} onValueChange={field.onChange} className="flex gap-6">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="male" id="male" disabled={!isEditing} />
                                <label htmlFor="male">Male</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="female" id="female" disabled={!isEditing} />
                                <label htmlFor="female">Female</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="other" id="other" disabled={!isEditing} />
                                <label htmlFor="other">Other</label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                  </div>
                  <div className="flex justify-end gap-2">
                    {!isEditing ? <Button type="button" className="glass-button" onClick={() => setIsEditing(true)}>Edit</Button> : <>
                        <Button type="button" variant="outline" onClick={() => {
                      profileForm.reset(lastProfile);
                      setIsEditing(false);
                    }}>Cancel</Button>
                        <Button type="submit" className="glass-button">Save Changes</Button>
                      </>}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Shipping Addresses</CardTitle>
              <CardDescription>Manage saved addresses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-end">
                <Button onClick={openAddAddress}>Add New Address</Button>
              </div>
              <div className="space-y-3">
                {addresses.length === 0 && <div className="text-sm text-muted-foreground">No addresses yet.</div>}
                {addresses.map(addr => <div key={addr.id} className="p-4 rounded-lg border flex items-start justify-between">
                    <div>
                      <div className="font-medium">{addr.address_line}</div>
                      <div className="text-sm text-muted-foreground">{addr.city}, {addr.state}{addr.postal_code ? `, ${addr.postal_code}` : ""}, {addr.country}</div>
                      {addr.is_default && <div className="text-xs text-green-600 mt-1">Default</div>}
                    </div>
                    <div className="flex gap-2">
                      {!addr.is_default && <Button variant="outline" size="sm" onClick={() => setDefaultAddress(addr.id)}>Set Default</Button>}
                      <Button variant="outline" size="sm" onClick={() => openEditAddress(addr)}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteAddress(addr.id)}>Delete</Button>
                    </div>
                  </div>)}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage password and session</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={async () => {
              if (!user?.email) return;
              await supabase.auth.resetPasswordForEmail(user.email, {
                redirectTo: window.location.origin + "/auth"
              });
              toast({
                title: "Password reset sent",
                description: "Check your email for the reset link."
              });
            }}>
                Change Password
              </Button>
              <Button variant="destructive" onClick={async () => {
              await supabase.auth.signOut();
              navigate("/", {
                replace: true
              });
            }}>
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAddress ? "Edit Address" : "Add Address"}</DialogTitle>
          </DialogHeader>
          <Form {...addressForm}>
            <form onSubmit={addressForm.handleSubmit(saveAddress)} className="space-y-4">
              <FormField control={addressForm.control} name="address_line" render={({
              field
            }) => <FormItem>
                    <FormLabel>Address Line</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={addressForm.control} name="city" render={({
                field
              }) => <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                <FormField control={addressForm.control} name="state" render={({
                field
              }) => <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={addressForm.control} name="postal_code" render={({
                field
              }) => <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Postal Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                <FormField control={addressForm.control} name="country" render={({
                field
              }) => <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
              </div>
              <div className="flex items-center gap-2">
                <input id="is_default" type="checkbox" checked={!!addressForm.watch("is_default")} onChange={e => addressForm.setValue("is_default", e.target.checked)} />
                <Label htmlFor="is_default">Set as default</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAddressDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>;
};
export default SettingsPage;