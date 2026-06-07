import { Helmet } from 'react-helmet-async';
import Hero from '../components/home/Hero';
import { FeaturedProducts, NewArrivals, BestSellers } from '../components/home/ProductSections';
import Categories from '../components/home/Categories';
import PromoSection from '../components/home/PromoSection';
import Testimonials from '../components/home/Testimonials';
import Newsletter from '../components/home/Newsletter';

const Home = () => (
  <>
    <Helmet>
      <title>Luxora | Premium Luxury Shopping</title>
      <meta name="description" content="Discover premium luxury watches, jewelry, bags and accessories at Luxora." />
    </Helmet>
    <Hero />
    <FeaturedProducts />
    <Categories />
    <NewArrivals />
    <PromoSection />
    <BestSellers />
    <Testimonials />
    <Newsletter />
  </>
);

export default Home;
