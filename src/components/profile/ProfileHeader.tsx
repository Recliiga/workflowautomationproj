
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ProfileData } from "@/types";

interface ProfileHeaderProps {
  profile: ProfileData;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="flex items-center space-x-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src={profile.avatar} alt={profile.name} />
        <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-xl font-semibold">{profile.name}</h2>
        <p className="text-sm text-muted-foreground capitalize">{profile.role}</p>
      </div>
    </div>
  );
}
