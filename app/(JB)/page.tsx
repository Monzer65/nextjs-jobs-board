import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchTypeTabs from "@/components/SearchTypeTabs";

export default function Home() {
  return (
    <div className='min-h-screen'>
      <main>
        <SearchTypeTabs />
      </main>
    </div>
  );
}
