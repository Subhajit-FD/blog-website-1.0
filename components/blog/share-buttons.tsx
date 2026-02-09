"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Check,
  Copy,
  Facebook,
  Linkedin,
  Share2,
  Instagram,
} from "lucide-react";
import { useState, isValidElement } from "react";
import { toast } from "sonner";

interface ShareButtonsProps {
  title: string;
  url: string; // Full URL or path
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // Use window.location.origin if url is relative
  const getFullUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}${url}`;
    }
    return url;
  };

  const shareLinks = [
    {
      name: "Threads",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M16.7051 11.1081C16.543 8.12137 14.911 6.41148 12.1708 6.39398C10.5193 6.3838 9.13771 7.08389 8.29233 8.36664L9.79941 9.40046C10.4334 8.43852 11.4342 8.24015 12.1593 8.24685C13.0616 8.2526 13.7425 8.51494 14.1832 9.02653C14.5038 9.39899 14.7183 9.91367 14.8245 10.5632C14.0246 10.4273 13.1594 10.3855 12.2345 10.4385C9.62919 10.5886 7.95426 12.1081 8.06675 14.2194C8.12384 15.2904 8.65739 16.2118 9.56906 16.8137C10.3399 17.3225 11.3326 17.5713 12.3644 17.515C13.727 17.4403 14.7959 16.9205 15.5416 15.9699C16.1079 15.248 16.4661 14.3125 16.6243 13.1338C17.2737 13.5257 17.7549 14.0414 18.0207 14.6613C18.4726 15.7151 18.499 17.4469 17.086 18.8587C15.848 20.0955 14.3598 20.6306 12.1108 20.6471C9.61601 20.6286 7.72924 19.8285 6.50253 18.269C5.35381 16.8088 4.76014 14.6996 4.73799 12C4.76014 9.30038 5.35381 7.19117 6.50253 5.73092C7.72924 4.17147 9.61597 3.37141 12.1107 3.35287C14.6236 3.37155 16.5433 4.17547 17.8169 5.74244C18.4415 6.51086 18.9123 7.47721 19.2227 8.60394L20.9888 8.13274C20.6125 6.74587 20.0205 5.55078 19.2148 4.55966C17.582 2.55073 15.1816 1.52134 12.1046 1.5C9.03385 1.52127 6.6725 2.55457 5.08614 4.57117C3.67451 6.3657 2.94634 8.87742 2.92188 12.0074C2.94634 15.1373 3.67451 17.6343 5.08614 19.4289C6.6725 21.4454 9.04616 22.4788 12.1169 22.5C14.847 22.4811 16.7713 21.7663 18.3566 20.1825C20.4307 18.1103 20.3682 15.513 19.6846 13.9185C19.1595 12.6943 18.1141 11.7129 16.7051 11.1081ZM12.2669 15.6648C11.125 15.7291 9.93869 15.2166 9.88019 14.1188C9.83684 13.3048 10.4595 12.3966 12.3369 12.2884C13.2594 12.2352 14.1138 12.2976 14.8701 12.463C14.6538 15.1648 13.3848 15.6035 12.2669 15.6648Z"></path>
        </svg>
      ),
      href: `https://threads.net/share?text=${encodeURIComponent(
        title,
      )}&url=${encodeURIComponent(getFullUrl())}`,
      color: "text-sky-500 bg-sky-500/10 hover:bg-sky-500/20",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        getFullUrl(),
      )}`,
      color: "text-blue-600 bg-blue-600/10 hover:bg-blue-600/20",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        getFullUrl(),
      )}`,
      color: "text-blue-700 bg-blue-700/10 hover:bg-blue-700/20",
    },
    {
      name: "WhatsApp",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M7.25361 18.4944L7.97834 18.917C9.18909 19.623 10.5651 20 12.001 20C16.4193 20 20.001 16.4183 20.001 12C20.001 7.58172 16.4193 4 12.001 4C7.5827 4 4.00098 7.58172 4.00098 12C4.00098 13.4363 4.37821 14.8128 5.08466 16.0238L5.50704 16.7478L4.85355 19.1494L7.25361 18.4944ZM2.00516 22L3.35712 17.0315C2.49494 15.5536 2.00098 13.8345 2.00098 12C2.00098 6.47715 6.47813 2 12.001 2C17.5238 2 22.001 6.47715 22.001 12C22.001 17.5228 17.5238 22 12.001 22C10.1671 22 8.44851 21.5064 6.97086 20.6447L2.00516 22ZM8.39232 7.30833C8.5262 7.29892 8.66053 7.29748 8.79459 7.30402C8.84875 7.30758 8.90265 7.31384 8.95659 7.32007C9.11585 7.33846 9.29098 7.43545 9.34986 7.56894C9.64818 8.24536 9.93764 8.92565 10.2182 9.60963C10.2801 9.76062 10.2428 9.95633 10.125 10.1457C10.0652 10.2428 9.97128 10.379 9.86248 10.5183C9.74939 10.663 9.50599 10.9291 9.50599 10.9291C9.50599 10.9291 9.40738 11.0473 9.44455 11.1944C9.45903 11.25 9.50521 11.331 9.54708 11.3991C9.57027 11.4368 9.5918 11.4705 9.60577 11.4938C9.86169 11.9211 10.2057 12.3543 10.6259 12.7616C10.7463 12.8783 10.8631 12.9974 10.9887 13.108C11.457 13.5209 11.9868 13.8583 12.559 14.1082L12.5641 14.1105C12.6486 14.1469 12.692 14.1668 12.8157 14.2193C12.8781 14.2457 12.9419 14.2685 13.0074 14.2858C13.0311 14.292 13.0554 14.2955 13.0798 14.2972C13.2415 14.3069 13.335 14.2032 13.3749 14.1555C14.0984 13.279 14.1646 13.2218 14.1696 13.2222V13.2238C14.2647 13.1236 14.4142 13.0888 14.5476 13.097C14.6085 13.1007 14.6691 13.1124 14.7245 13.1377C15.2563 13.3803 16.1258 13.7587 16.1258 13.7587L16.7073 14.0201C16.8047 14.0671 16.8936 14.1778 16.8979 14.2854C16.9005 14.3523 16.9077 14.4603 16.8838 14.6579C16.8525 14.9166 16.7738 15.2281 16.6956 15.3913C16.6406 15.5058 16.5694 15.6074 16.4866 15.6934C16.3743 15.81 16.2909 15.8808 16.1559 15.9814C16.0737 16.0426 16.0311 16.0714 16.0311 16.0714C15.8922 16.159 15.8139 16.2028 15.6484 16.2909C15.391 16.428 15.1066 16.5068 14.8153 16.5218C14.6296 16.5313 14.4444 16.5447 14.2589 16.5347C14.2507 16.5342 13.6907 16.4482 13.6907 16.4482C12.2688 16.0742 10.9538 15.3736 9.85034 14.402C9.62473 14.2034 9.4155 13.9885 9.20194 13.7759C8.31288 12.8908 7.63982 11.9364 7.23169 11.0336C7.03043 10.5884 6.90299 10.1116 6.90098 9.62098C6.89729 9.01405 7.09599 8.4232 7.46569 7.94186C7.53857 7.84697 7.60774 7.74855 7.72709 7.63586C7.85348 7.51651 7.93392 7.45244 8.02057 7.40811C8.13607 7.34902 8.26293 7.31742 8.39232 7.30833Z"></path>
        </svg>
      ),
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        title,
      )}%20${encodeURIComponent(getFullUrl())}`,
      color: "text-green-600 bg-green-600/10 hover:bg-green-600/20",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: `https://www.instagram.com/share?text=${encodeURIComponent(
        title,
      )}&url=${encodeURIComponent(getFullUrl())}`,
      color: "text-pink-600 bg-pink-600/10 hover:bg-pink-600/20",
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(getFullUrl());
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 rounded-full text-muted-foreground hover:text-foreground"
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>Share this article</DrawerTitle>
            <DrawerDescription>
              Share this post with your network or copy the link.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="grid grid-cols-4 gap-4">
              {shareLinks.map((link) => (
                <div
                  key={link.name}
                  className="flex flex-col items-center gap-2"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className={`h-14 w-14 rounded-full border-2 ${link.color} transition-colors`}
                    onClick={() =>
                      window.open(link.href, "_blank", "width=600,height=400")
                    }
                  >
                    {isValidElement(link.icon) ? (
                      <div className="h-6 w-6 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
                        {link.icon}
                      </div>
                    ) : (
                      // @ts-ignore
                      <link.icon className="h-6 w-6" />
                    )}
                  </Button>
                  <span className="text-xs font-medium text-muted-foreground">
                    {link.name}
                  </span>
                </div>
              ))}
              <div className="flex flex-col items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 rounded-full border-2 hover:bg-muted transition-colors"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-6 w-6 text-green-500" />
                  ) : (
                    <Copy className="h-6 w-6" />
                  )}
                </Button>
                <span className="text-xs font-medium text-muted-foreground">
                  {copied ? "Copied" : "Copy Link"}
                </span>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="ghost" size="lg" className="rounded-full">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
