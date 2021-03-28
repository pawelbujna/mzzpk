import axios from "axios";
import Layout from "../components/Layout";
import Article from "../components/Article";

import withUser from "./withUser";

const Articles = ({ articles }) => {
  const listArticles = () =>
    articles.map((article) => <Article data={article} key={article.slug} />);

  return (
    <Layout>
      <div>
        <div className="alert alert-warning" role="alert">
          <h4 className="alert-heading">
            <strong>Pamiętaj!</strong>
          </h4>
          <p>
            Jeżeli jesteś zalogowany na stronie{" "}
            <a href="/" className="alert-link">
              mzzpk.pl
            </a>{" "}
            to znaczy, że jesteś członkiem naszej organizacji związkowej.
            Pamiętaj, że:{" "}
            <strong>
              Kopiowanie, przetwarzanie, rozpowszechnianie tych materiałów w
              całości lub w części bez zgody zarządu związku jest zabronione.
            </strong>
          </p>
        </div>
      </div>

      <br />

      <div className="row">
        <div className="col-md-12">
          <h1 className="font-weight-bold">Ogłoszenia</h1>
          <br />
          {articles.length === 0 && <p>Brak ogłoszeń.</p>}
        </div>
      </div>
      {listArticles()}
    </Layout>
  );
};

export default Articles;

export const getServerSideProps = withUser(async () => {
  let data;

  try {
    const response = await axios.get(`${process.env.API}/article`);
    data = response.data;
  } catch (error) {
    throw new Error("Something went wrong when downloading articles.");
  }

  return {
    props: {
      articles: data,
    },
  };
});
