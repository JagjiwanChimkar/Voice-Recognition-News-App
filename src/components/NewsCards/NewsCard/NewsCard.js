import React,{createRef,useState,useEffect} from "react";
import useStyles from './style';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@material-ui/core";

import classNames from 'classnames';

const NewsCard = ({article: { description, publishedAt, title, source, url, urlToImage },
  i,activeArticle}) => {
  const classes=useStyles();

  const [elRefs, setElRefs] = useState([]);
  const scrollToRef = (ref) => window.scroll(0, ref.current.offsetTop - 50);

  useEffect(() => {
    window.scroll(0, 0);

    setElRefs((refs) => Array(20).fill().map((_, j) => refs[j] || createRef()));
  }, []);

  useEffect(() => {
    if (i === activeArticle && elRefs[activeArticle]) {
      scrollToRef(elRefs[activeArticle]);
    }
  }, [i, activeArticle, elRefs]);

  return (
    <Card ref={elRefs[i]} className={classNames(classes.card, activeArticle===i?classes.activeCard : null)}>
      <CardActionArea href={url} target="_blank">
        <CardMedia className={classes.media}
          image={
            urlToImage ||
            "https://newsinterpretation.com/wp-content/uploads/2020/03/news33.jpg"
          }
        />
        <div className={classes.details}>
          <Typography variant="body2" component="h2" color="textSecondary">
            {new Date(publishedAt).toDateString()}
          </Typography>
          <Typography variant="body2" component="h2" color="textSecondary">
            {source.name}
          </Typography>
        </div>
        <Typography className={classes.title} gutterButton variant="h5">
          {title}
        </Typography>
        <CardContent>
          <Typography variant="body2" component="p" color="textSecondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className={classes.cardActions}>
        <Button size="small" color="primary">
          Learn More
        </Button>
        <Typography variant="h5" color="textSecondary">
          {i + 1}
        </Typography>
      </CardActions>
    </Card>
  );
};

export default NewsCard;
