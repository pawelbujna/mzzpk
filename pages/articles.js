import axios from "axios";
import Layout from "../components/Layout";
import Article from "../components/Article";

import withUser from "./withUser";

const Articles = ({ articles }) => {
  const listArticles = () =>
    articles.map((article) => <Article data={article} key={article.slug} />);

  return (
    <Layout>
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
