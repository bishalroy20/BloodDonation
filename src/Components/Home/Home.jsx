// src/pages/Home.jsx

import RecentBlogsSlider from "../Blog/RecentBlogsSlider";
import Banner from "./Banner";
import BloodDonationInfoSection from "./BloodDonationInfoSection";
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
        <RecentBlogsSlider />
        <Featured />
        <BloodDonationInfoSection />
        <RecentRequests />
        <ContactUs />
        <StatsSection />
      </main>
      
    </div>
  );
}