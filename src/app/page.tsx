import Link from "next/link";
import FeaturedCourses from "@/app/components/FeaturedCourses";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden px-10">
      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "300px 300px",
        }}
      />

      {/* Hero content */}
      <section className="relative  mx-auto flex max-w-7xl flex-col lg:flex-row items-center gap-12  pt-32 pb-20">
        {/* Left side — text */}
        <div className="flex max-w-xl flex-col gap-8 lg:w-1/2 mt-40">
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-foreground md:text-6xl mb-10 mt-10  ">
            We&apos;re changing the way people learn
          </h1>
          <p className="text-lg leading-8 text-foreground/60 mb-10">
            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
            lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat
            fugiat aliqua. Anim aute id magna aliqua ad ad non deserunt sunt.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/courses"
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background shadow-sm shadow-accent/30 transition-colors hover:bg-ballet-slipper"
            >
              Get started
            </Link>
            {/*<Link*/}
            {/*  href="/courses"*/}
            {/*  className="flex items-center gap-1 text-sm font-semibold text-foreground transition-colors hover:text-foreground/80"*/}
            {/*>*/}
            {/*  Live demo*/}
            {/*  <svg*/}
            {/*    xmlns="http://www.w3.org/2000/svg"*/}
            {/*    width="16"*/}
            {/*    height="16"*/}
            {/*    viewBox="0 0 24 24"*/}
            {/*    fill="none"*/}
            {/*    stroke="currentColor"*/}
            {/*    strokeWidth="2"*/}
            {/*    strokeLinecap="round"*/}
            {/*    strokeLinejoin="round"*/}
            {/*  >*/}
            {/*    <line x1="5" y1="12" x2="19" y2="12" />*/}
            {/*    <polyline points="12 5 19 12 12 19" />*/}
            {/*  </svg>*/}
            {/*</Link>*/}
          </div>
        </div>

        {/* Right side — image tiles */}
        <div className="relative hidden h-[600px] w-full lg:block lg:w-1/2">
          {/* Tile 1 */}
          <div className="absolute top-0 left-130 h-100 w-70  rotate-6 overflow-hidden rounded-2xl shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=500&fit=crop"
              alt="People collaborating"
              className="h-full w-full object-cover"
            />
          </div>
          {/* Tile 2 */}
          <div className="absolute top-5 right-90 h-100 w-70 rotate-[-3deg] overflow-hidden rounded-2xl shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=500&fit=crop"
              alt="Student learning"
              className="h-full w-full object-cover"
            />
          </div>
          {/*/!* Tile 3 *!/*/}
          {/*<div className="absolute top-56 left-8 h-100 w-70  rotate-3 overflow-hidden rounded-2xl shadow-2xl">*/}
          {/*  <img*/}
          {/*    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=500&fit=crop"*/}
          {/*    alt="Team meeting"*/}
          {/*    className="h-full w-full object-cover"*/}
          {/*  />*/}
          {/*</div>*/}
          {/* Tile 4 */}
          <div className="absolute top-90 left-150 h-100 w-70  rotate-[-5deg] overflow-hidden rounded-2xl shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=500&fit=crop"
              alt="Woman working"
              className="h-full w-full object-cover"
            />
          </div>
          {/* Tile 5 */}
          <div className="absolute top-100 left-50 h-100 w-70  rotate-8 overflow-hidden rounded-2xl shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=500&fit=crop"
              alt="People in office"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Featured courses */}
      <FeaturedCourses />

    </div>
  );
}


