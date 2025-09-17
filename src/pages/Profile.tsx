import { ProfileCard } from "@/components/ProfileCard";
import { ReadmeCard } from "@/components/ReadmeCard";

export function Profile() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar - Profile Info */}
        <aside className="lg:w-80 flex-shrink-0">
          <div className="fade-in">
            <ProfileCard
              name="Your Name"
              username="yourusername"
              bio="A passionate full-stack developer and design thinker creating amazing digital experiences."
              location="Your City, Country"
              website="yourwebsite.com"
              company="Your Company"
              email="you@email.com"
              followers={42}
              following={58}
            />
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="slide-up">
            <ReadmeCard />
          </div>
        </main>
      </div>
    </div>
  );
}