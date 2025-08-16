import { useLocation } from "wouter";

export function useNavigation() {
  const [, setLocation] = useLocation();
  
  // Navigation function
  const navigate = (path: string) => setLocation(path);
  
  return navigate;
}