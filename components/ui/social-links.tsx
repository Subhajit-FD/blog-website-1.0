import { Facebook, Instagram } from "lucide-react";
import Link from "next/link";

const SocialLinks = () => {
  return (
    <div className="flex items-center gap-2">
      <Link href="#" className="bg-foreground text-secondary p-1.5 rounded-full">
        <Facebook size={16} />
      </Link>
      <Link href="#" className="bg-foreground text-secondary p-1.5 rounded-full">
        <Instagram size={16} />
      </Link>
    </div>
  );
}

export default SocialLinks