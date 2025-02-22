import HomePage from '@/components/home';
import Container from '@/components/reusables/container';
import Navbar from '@/components/reusables/navbar';

export default function Home() {
  return (
    <Container>
      <Navbar />
      <HomePage />
    </Container>
  );
}
