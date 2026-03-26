import { Container } from "@/components/Container";
import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <section className="py-swiss-10">
      <Container>
        <h1 className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[1.1] tracking-[-0.02em] mb-swiss-4">404</h1>
        <p className="text-[1.25rem] leading-[1.6] text-swiss-gray-600 mb-swiss-7">Page not found.</p>
        <Button href="/" variant="primary">Back to Home</Button>
      </Container>
    </section>
  );
}
