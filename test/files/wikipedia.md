---
baseUrl:  https://en.wikipedia.org/
title: Untitled
---

Command | Target | Value
------- | ------ | ----- |
open | /wiki/Main_Page | 
type | id=searchInput | Google
clickAndWait | id=searchButton | 
assertText | id=firstHeading | Google
assertText | id=pt-anonuserpage | Not logged in
