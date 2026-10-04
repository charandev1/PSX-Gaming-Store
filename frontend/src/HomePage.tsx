import Carousel from './CarouselBody';
import HomepageBody from './HomePageBody';
import Category from './CategoryBody';
import SubscriptionBody from './SubscriptionBody';
import Footer from './FooterBody';
const HomePage = () => {
  return (
    //  'var(--clr-neutral)'
    <div>
      
      
      <HomepageBody />
      <Carousel />
      <Category />
      <SubscriptionBody />
      <Footer />
    </div>
  );
};

export default HomePage;