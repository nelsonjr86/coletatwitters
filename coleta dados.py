# ===============================================
# twitter-to-mongo.py v1.0 Created by Sam Delgado
# ===============================================
try:
    from pymongo.connection import Connection
except ImportError as e:
    from pymongo import MongoClient as Connection
   
import json
from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
import datetime

# As informações de conexão MongoDB. Isso pressupõe que o nome do banco de dados seja o TwitterStream, e o nome da coleção é tweets.
connection = Connection('localhost', 27017)
db = connection.TwitterStream
db.tweets.ensure_index("id", unique=True, dropDups=True)
collection = db.tweets

# Adicione as palavras-chave que você deseja acompanhar. Eles podem ser dinheiro, hashtags, ou palavras.
keywords = ['$goog', '#funny', 'ipad']

# Opcional - Apenas pegar tweets de linguagem específica
language = ['pt']

# Você precisa substituí-los por seus próprios valores que obtém depois de criar um aplicativo no portal de desenvolvedores do Twitter.
consumer_key = "Codigo gerado do twitter"
consumer_secret = "Codigo gerado do twitter"
access_token = "Codigo gerado do twitter"
access_token_secret = "Codigo gerado do twitter"

# O código a seguir irá obter Tweets do fluxo e armazenar apenas os campos importantes para o seu banco de dados
class StdOutListener(StreamListener):

    def on_data(self, data):

        # Carregar o Tweet na variável "t"
        t = json.loads(data)

        # Puxe dados importantes do tweet para armazenar no banco de dados.
        tweet_id = t['id_str']  # O ID do Twitter do Twitter em formato de seqüência de caracteres
        username = t['user']['screen_name']  # O nome de usuário do autor do Tweet
        followers = t['user']['followers_count']  # O número de seguidores que o autor do Tweet tem
        text = t['text']  # O corpo inteiro do Tweet
        hashtags = t['entities']['hashtags']  # Qualquer hashtags usado no Tweet
        user_mentions = t['entities']['user_mentions'] # usuario usado no Tweet
        url = t['entities']['urls'] # pega a url do texto do Tweet
        dt = t['created_at']  # O timestamp de quando o Tweet foi criado
        language = t['lang']  # A linguagem do Tweet

        # Converta a seqüência de caracteres timestamp dada pelo Twitter para um objeto de data chamado "criado". Isto é mais facilmente manipulado no MongoDB.
        created = datetime.datetime.strptime(dt, '%a %b %d %H:%M:%S +0000 %Y')

        # Carregar todos os dados extraídos Tweet na variável "tweet" que será armazenado no banco de dados
        tweet = {'id':tweet_id, 'username':username, 'followers':followers, 'text':text, 'hashtags':hashtags, 'user_mentions':user_mentions, 'url':url, 'language':language, 'created':created}

        # Salve os dados do Tweet refinados para o MongoDB
        collection.save(tweet)

        # Opcional - Imprima o nome de usuário eo texto de cada Tweet no seu console em tempo real, à medida que são extraídos do fluxo
        print (username + ':' + ' ' + text)
        return True

    # Imprime o motivo de um erro no seu console
    def on_error(self, status):
        print (status)

# Algum código Tweepy que pode ser deixado sozinho. Ele puxa de variáveis ​​na parte superior do script
if __name__ == '__main__':
    l = StdOutListener()
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)

    stream = Stream(auth, l)
    stream.filter(track=keywords, languages=language)
