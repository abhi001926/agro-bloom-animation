import { Wheat, Droplets, Leaf, Sun, Cloud, Thermometer } from "lucide-react";

const FloatingIcons = () => {
  const icons = [
    { Icon: Wheat, position: "top-20 left-10", delay: "animate-float" },
    { Icon: Droplets, position: "top-40 right-16", delay: "animate-float-delay-1" },
    { Icon: Leaf, position: "bottom-32 left-20", delay: "animate-float-delay-2" },
    { Icon: Sun, position: "top-32 left-1/2", delay: "animate-float" },
    { Icon: Cloud, position: "bottom-20 right-10", delay: "animate-float-delay-1" },
    { Icon: Thermometer, position: "top-60 right-32", delay: "animate-float-delay-2" },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {icons.map((item, index) => {
        const { Icon, position, delay } = item;
        return (
          <div
            key={index}
            className={`absolute ${position} ${delay} opacity-20 text-primary`}
          >
            <Icon size={32} />
          </div>
        );
      })}
    </div>
  );
};

export default FloatingIcons;