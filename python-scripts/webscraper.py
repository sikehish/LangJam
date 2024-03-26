import requests
from bs4 import BeautifulSoup

# URL you want to scrape
url = "https://javascript.info/intro"

# Send a GET request to the URL
res = requests.get(url)

# Get the content of the response
content = res.content

# Create a BeautifulSoup object to parse the HTML content
soup = BeautifulSoup(content, "html.parser")

# Save the parsed HTML content to a file
with open("output.html", "w", encoding="utf-8") as f:
    f.write(soup.prettify())

print("Data has been saved to output.html")
