import Header from "@/components/Header";
import SearchSection from "@/components/SearchSection";
import FeaturedJobsSection from "@/components/FeaturedJobsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className='min-h-screen font-[family-name:var(--font-vazirmatn-regular)]'>
      <Header />
      <main>
        <SearchSection />
        <FeaturedJobsSection />
      </main>
      <Footer />
    </div>
  );
}
