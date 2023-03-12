const express = require('express');
const app = express();
const request = require('request');
const path = require('path');

const OPENAI_API_KEY = process.env.TOKEN; // à remplacer par votre clé API OpenAI
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/generate', (req, res) => {
    const article_text = req.body.article_text;
    const style = req.body.style;

    const options = {
        url: 'https://api.openai.com/v1/chat/completions',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        json: {
            messages: [
              {"role": "system", "content": "Dans une note de service, il n'y a pas d'objet mais un titre Note de Service n°x, on ne dois pas utiliser nous ou je, le ton doit etre direct et à la voix passive. Utilise ces informations pour en rédiger une à l'aide de ce résumé :"},
              {"role": "user", "content": article_text} ,
          ],
            model : "gpt-3.5-turbo",
            max_tokens: 500,
            temperature: 0.5
        }
    };

    request(options, (err, response, body) => {
      if (err) {
          return res.send('Error generating response');
      }
  
      if (body.error) {
          return res.send(`OpenAI API error: ${body.error.message}`);
      }
  
      const response_text = '<center><h2 style="font-weight: 600; font-size: 3vw; color:white;">Résultat :</h2></center><br><p style="color:white; font-size: 20px;">'+ body.choices[0].message.content +'</p>';
      console.log(body.choices[0])
      res.send(response_text);
      console.log(response_text)
  });
  
  
});

app.listen(process.env.PORT || port, () => console.log('Listening on port 3000'));

