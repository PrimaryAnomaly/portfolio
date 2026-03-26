import { Container } from "./Container";
import { siteConfig } from "@/content/site";

export function Footer() {
  return (
    <footer className="py-swiss-8 text-center">
      <Container>
        <p className="text-[0.875rem] text-swiss-gray-600 mx-auto">
          &copy; {new Date().getFullYear()} {siteConfig.name}
        </p>
      </Container>
    </footer>
  );
}
