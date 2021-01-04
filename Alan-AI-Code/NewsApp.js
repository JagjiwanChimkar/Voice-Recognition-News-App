intent('What does this app do?','What i do for you?',
      reply('This is a news app'));

intent('start a command',(p)=>{
    p.play({command:'testCommand'});
})

const API_KEY='f5278a29a4f94fe49e59bd624a0a4da3';
let savedArticles=[];

// News by Sources
intent('Give me the news from $(source* (.*))',(p)=>{
    let NEWS_API_URL=`https://newsapi.org/v2/top-headlines?apiKey=${API_KEY}`
    
    if(p.source.value){
        NEWS_API_URL=`${NEWS_API_URL}&sources=${p.source.value.toLowerCase().split(" ").join('-')}`
    }
    
    api.request(NEWS_API_URL,(err,res,body)=>{
        const {articles}=JSON.parse(body)
        
        if(!articles.length){
            p.play('Sorry,please try the news from a different source')
            return;
        }
         
        savedArticles=articles;
        p.play({command: 'newHeadlines',articles});
        p.play(`Here are the (latest|recent) ${p.source.value}.`);
        
        p.play('Would you like me to read the headlines?');
        p.then(confirmation);
    });
  
    
    
})

// News by Term

intent('What\'s up with  $(term* (.*))',(p)=>{
    let NEWS_API_URL=`https://newsapi.org/v2/everything?apiKey=${API_KEY}`
    
    if(p.term.value){
        NEWS_API_URL=`${NEWS_API_URL}&q=${p.term.value}`
    }
    
    api.request(NEWS_API_URL,(err,res,body)=>{
        const {articles}=JSON.parse(body)
        
        if(!articles.length){
            p.play('Sorry,please try the something else.')
            return;
        }
         
        savedArticles=articles;
        p.play({command: 'newHeadlines',articles});
        p.play(`Here are the (latest|recent) articles on ${p.term.value}.`);
        
        p.play('Would you like me to read the headlines?');
        p.then(confirmation);
    });
   
    
})

// News by Categories

const CATEGORIES = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
const CATEGORIES_INTENT = `${CATEGORIES.map((category) => `${category}~${category}`).join('|')}|`;

intent(`(show|what is|tell me|what's|what are|what're|read) (the|) (recent|latest|) $(N news|headlines) (in|about|on|) $(C~ ${CATEGORIES_INTENT})`,
       `(read|show|get|bring me|give me) (the|) (recent|latest) $(C~ ${CATEGORIES_INTENT}) $(N news|headlines)`,(p)=>{
    
    let NEWS_API_URL=`https://newsapi.org/v2/top-headlines?apiKey=${API_KEY}&country=in`
    
    if(p.C.value){
        NEWS_API_URL=`${NEWS_API_URL}&category=${p.C.value}`
    }
    
    api.request(NEWS_API_URL,(err,res,body)=>{
        const {articles}=JSON.parse(body)
        
        if(!articles.length){
            p.play('Sorry,please try for different category.')
            return;
        }
         
        savedArticles=articles;
        
        p.play({command: 'newHeadlines',articles});
        if(p.C.value){
            p.play(`Here are the (latest|recent) articles on ${p.C.value}.`);
        }
        else{
             p.play(`Here are the (latest|recent) News`);
        }
        
        p.play('Would you like me to read the headlines?');
        p.then(confirmation);
        
    });
    
})

//context
const confirmation=context(()=>{
    intent('yes',async(p)=>{
       for(let i=0;i<savedArticles.length;i++){
           p.play({command:'highlight',article: savedArticles[i]})
           p.play(`${savedArticles[i].title}`)
       }
    })
    
    intent('no',async(p)=>{
        p.play(`Ok! Sure.`)
    })
})

intent(`Open (the|) (article|) (number|) $(number* (.*))`,(p)=>{
    if(p.number.value){
        p.play({command:'open',number:p.number.value,articles:savedArticles})
   
    }
})

intent('(go|) back',(p)=>{
    p.play('Sure, going back')
    p.play({command:'newHeadlines',articles:[]})
})


