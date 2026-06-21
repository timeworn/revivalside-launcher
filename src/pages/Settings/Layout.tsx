import { useOutlet } from "react-router-dom";

export const SettingsLayout = () => {
  const outlet = useOutlet();

  return <>{outlet}</>;
};
