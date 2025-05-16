
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { UserRole } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

interface UserCreationFormProps {
  onUserCreated: (newUser: any) => void;
}

export function UserCreationForm({ onUserCreated }: UserCreationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "client" as UserRole,
      company: "",
      specialties: "",
      avatar: ""
    }
  });

  const role = form.watch("role");

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        form.setValue("avatar", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would send the data to an API
      console.log("Creating new user:", data);
      
      // Mock user creation with generated ID
      const newUserId = `new-${Date.now()}`;
      
      // Create user object based on role
      let newUser;
      
      if (data.role === "client") {
        newUser = {
          id: newUserId,
          name: data.name,
          email: data.email,
          role: "client",
          company: data.company,
          avatar: data.avatar || "", // Using uploaded avatar or default
          assignedFreelancers: []
        };
      } else if (data.role === "freelancer") {
        const specialtiesArray = data.specialties ? data.specialties.split(',').map((s: string) => s.trim()) : [];
        
        newUser = {
          id: newUserId,
          name: data.name,
          email: data.email,
          role: "freelancer",
          specialties: specialtiesArray,
          certifications: [],
          avatar: data.avatar || "", // Using uploaded avatar or default
          assignedClients: []
        };
      }
      
      // Pass the new user to the parent component
      onUserCreated(newUser);
      
      toast.success(`New ${data.role} account created successfully`);
      form.reset();
      setAvatarPreview(null);
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="flex flex-col items-center mb-4">
          <Avatar className="h-24 w-24 mb-2">
            <AvatarImage src={avatarPreview || ""} />
            <AvatarFallback className="text-lg">
              {form.watch("name") ? form.watch("name").charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
          
          <label htmlFor="avatar-upload" className="cursor-pointer">
            <div className="flex items-center gap-2 text-sm text-primary">
              <Upload className="h-4 w-4" />
              <span>Upload profile picture</span>
            </div>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </label>
        </div>

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Role</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="freelancer">Freelancer</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="user@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Set initial password" {...field} />
              </FormControl>
              <FormDescription>
                User can change this after first login
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {role === "client" && (
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Inc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {role === "freelancer" && (
          <FormField
            control={form.control}
            name="specialties"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specialties</FormLabel>
                <FormControl>
                  <Input placeholder="Video Editing, Motion Graphics" {...field} />
                </FormControl>
                <FormDescription>
                  Enter specialties separated by commas
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create User"}
        </Button>
      </form>
    </Form>
  );
}
