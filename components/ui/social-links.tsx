import { Facebook, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

const SocialLinks = () => {
  return (
    <div className="flex items-center gap-2">
      <Link
        href="#"
        className="bg-foreground text-secondary p-1.5 rounded-full hover:opacity-80 transition-opacity"
      >
        <Facebook size={16} />
      </Link>
      <Link
        href="#"
        className="bg-foreground text-secondary p-1.5 rounded-full hover:opacity-80 transition-opacity"
      >
        <Instagram size={16} />
      </Link>
      <Link
        href="#"
        className="bg-foreground text-secondary p-1.5 rounded-full hover:opacity-80 transition-opacity"
      >
        <Linkedin size={16} />
      </Link>
      <Link
        href="#"
        className="bg-foreground text-secondary p-1.5 rounded-full hover:opacity-80 transition-opacity flex items-center justify-center w-[28px] h-[28px]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path d="M8.00098 8C9.07612 8 11.4983 7.32669 11.4983 3.5V2H12.9982V8H18.001V10H12.9982V12.9091C13.0013 15.3906 13.0013 16.596 13.001 17C12.9992 19.2084 14.6163 20.4 17.7861 20.4V22C17.1509 21.9992 16.4034 21.9992 15.5437 22C13.1417 22.0023 10.9982 19.9649 10.9982 17.4545V10H7.00098V8H8.00098Z"></path>
        </svg>
      </Link>
    </div>
  );
};

export default SocialLinks;
