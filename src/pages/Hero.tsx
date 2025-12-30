import { useNavigate } from "react-router-dom";
import { HeroSection } from "@/components/HeroSection";

const Hero = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/app");
  };

  return <HeroSection onStart={handleStart} />;
};

export default Hero;
