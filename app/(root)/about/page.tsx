import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full py-24 md:py-32 bg-foreground/20 text-background flex items-center justify-center text-center overflow-hidden">
        <div className="relative z-10 container px-4 space-y-6">
          <div className="inline-block px-3 py-1 rounded-full bg-background/10 text-background text-xs font-semibold tracking-wide uppercase mb-4 border border-background/20">
            Our Story
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter">
            About Blogzenx
          </h1>
          <p className="text-lg md:text-xl text-muted/80 max-w-2xl mx-auto leading-relaxed">
            We are building a community of thinkers, writers, and readers who
            believe in the power of well-told stories.
          </p>
        </div>

        {/* Background Patterns */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-transparent to-foreground/90" />
      </section>

      {/* Mission Section */}
      <section className="py-20 md:py-32">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted">
              {/* Check if we have an image to use, maybe from public or just a placeholder div */}
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Team collaboration"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Empowering Voices, <br /> Inspiring Minds.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Blogzenx started with a simple idea: everyone has a story worth
                telling. We created this platform to bridge the gap between
                passionate writers and curious readers.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                In a world of noise, we prioritize clarity, depth, and
                authenticity. Whether it's technology, culture, or personal
                growth, we curate content that matters.
              </p>

              <div className="space-y-4 pt-4">
                {[
                  "Independent Journalism",
                  "Diverse Perspectives",
                  "Community Driven",
                  "Verified Sources",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="font-medium text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Impact Section */}
      <section className="bg-muted/30 py-20 border-y">
        <div className="container px-4 mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Active Readers", value: "50K+" },
            { label: "Stories Published", value: "1.2K+" },
            { label: "Writers", value: "200+" },
            { label: "Countries", value: "30+" },
          ].map((stat) => (
            <div key={stat.label} className="space-y-2">
              <div className="text-4xl md:text-5xl font-black text-foreground">
                {stat.value}
              </div>
              <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-center space-y-8">
        <h2 className="text-3xl md:text-4xl font-bold">
          Ready to start reading?
        </h2>
        <Button asChild size="lg" className="rounded-full px-8 h-12 text-lg">
          <Link href="/latest">
            Explore Latest Stories <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
