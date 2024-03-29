import React, { useState, useEffect } from "react";
import alanBtn from "@alan-ai/alan-sdk-web";
import wordsToNumbers from "words-to-numbers";
import NewsCards from "./components/NewsCards/NewsCards";
import useStyles from "./style";
import "./app.css";

const alanKey =
  "6178734f7eade17275a128d00552281f2e956eca572e1d8b807a3e2338fdd0dc/stage";
const App = () => {
  const classes = useStyles();

  //const [isOpen, setIsOpen] = useState(false);
  const [newsArticles, setNewsArticles] = useState([]);
  const [activeArticle, setActiveArticle] = useState(-1);

  useEffect(() => {
    alanBtn({
      key: alanKey,
      onCommand: ({ command, articles, number }) => {
        if (command === "newHeadlines") {
          console.log(articles);
          setNewsArticles(articles);
          setActiveArticle(-1);
        } else if (command === "highlight") {
          setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
        } else if (command === "open") {
          const parsedNumber =
            number.length > 2
              ? wordsToNumbers(number, { fuzzy: true })
              : number;
          const article = articles[parsedNumber - 1];

          window.open(article.url, "_blank");
          alanBtn().playText("Opening...");
        }
      },
    });
  }, []);

  return (
    <>
      <div>
        <h1 style={{ textAlign: "center" }}>Voice-Recognition News-App</h1>
        <div className={classes.logoContainer}>
          
          <img
            src="https://alan.app/brand_assets/logo-horizontal/color/alan-logo-horizontal-color.png"
            className={classes.alanLogo}
            alt="alan-logo"
          />
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8ITjavEszl2e4vHRW1ODFgCSTxKLfnVg1YA&usqp=CAU"
            className={classes.newsApiLogo}
            alt="alan-logo"
          />
          
        </div>
        <NewsCards articles={newsArticles} activeArticle={activeArticle} />
      </div>
    </>
  );
};

export default App;
