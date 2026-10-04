import Carousel from '../../components/homepage/carousel/Carousel.component';
import HomepageBody from '../../components/homepage/HomepageBody.component';
import Footer from '../../components/homepage/Footer.component';
import Navbar from 'components/nav/Nav.component';

const HomePage = () => {
  return (
    <div style={{ backgroundColor: 'var(--clr-neutral)' }}>
      <Navbar />
      <Carousel />
      <HomepageBody />
      <Footer />
    </div>
  );
};

export default HomePage;
