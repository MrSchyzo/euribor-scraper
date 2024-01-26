from bs4 import BeautifulSoup
from bs4.element import Tag
import requests
import re
import sys

def tr_into_record(year: int, previous_month: str, tag: Tag) -> (int, str, [str]):
    tds = tag.find_all("td")
    mm, dd = reversed(re.split("[/()]", tds[0].text.strip(" ")))
    proposed = f'{year}/{mm}/{dd}'

    # Why this? Because in 2023-2024 they decided to merge both years together 🥲
    if previous_month == '12' and mm == '01':
        next_year = year + 1
        actual = f'{next_year}/{mm}/{dd}'
        return (next_year, mm, [actual, *[t.text.strip(" ") for t in tds[1:]]])

    return (year, mm, [proposed, *[t.text.strip(" ") for t in tds[1:]]])

def download(type: str, header: str):
    home = f"https://www.euribor.it"
    url = f"{home}/tassi-storici-{type}/"

    print(f"Downloading the list of {type} history tables from {url}")
    dom = BeautifulSoup(requests.get(url).content, 'html.parser')
    with open(f"{type}.csv", "w") as file:
        file.write(f"{header}\n")
        for year, href in reversed([(t.text.split(" ")[1], t.attrs['href']) for t in dom.select("div ul li:not([class]) a")]):
            print(f"Downloading year {year} from {home}{href}", file=sys.stderr)
            # 🤓 :has() pseudo-selector is not supported in CSS 3 or lower!
            rows = BeautifulSoup(requests.get(f"{home}{href}").content, 'html.parser').select("tbody tr:has(td)")
            
            # This site is a joy, records are reversed after 2019 🥲
            if int(year) > 2019:
                rows.reverse()
            
            print(f"Dumping {year} into file", file=sys.stderr)
            current_year = int(year)
            current = f'{current_year}/01/01'
            for r in rows:
                current_year, current, record = tr_into_record(current_year, current, r)
                file.write(",".join(record) + "\n")
            print(f"{year} is now dumped into the file", file=sys.stderr)


download("eurirs", "DATE,10Y,15Y,20Y,25Y,30Y")
download("euribor", "DATE,1M,3M,6M,12M")