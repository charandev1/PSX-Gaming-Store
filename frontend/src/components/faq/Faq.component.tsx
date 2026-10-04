import { useNavigate } from 'react-router-dom';

const Faq = () => {
  const navigate = useNavigate();
  return (
    <>
      <button onClick={() => navigate(-1)}>back</button>
      <div> Faq</div>
    </>
  );
};

export default Faq;
