// src/pages/Home.jsx

import Banner from "./Banner";
import ContactUs from "./ContactUs";
import Featured from "./Featured";
import Footer from "./Footer";
import Navbar from "./Navbar";
import RecentRequests from "./RecentRequests";
import StatsSection from "./StatsSection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-1">
        <Banner />
        <Featured />
        <RecentRequests />
        <ContactUs />
        <StatsSection />
      </main>
      
    </div>
  );
}