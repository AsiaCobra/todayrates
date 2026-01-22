I want to write small application using react and supabase( DB as a service).

The UI should be simple and clean.

Here are the features I want in my application:
1. Super admin user.
2. loging/logout functionality.
3. CRUD operations for daily exchange rates.
  USD to MMK with selling and buying rates.
  THB to MMK with selling and buying rates.
  etc.
4. View exchange rate history.
5. Responsive design for mobile and desktop.

You can use dummy exchange rate data for testing purposes.


Refre site: https://24k.5w4n.app/

Supported currencies: https://forex.cbm.gov.mm/api/currencies
Daily exchange rates: https://forex.cbm.gov.mm/api/latest, 
https://cdn.moneyconvert.net/api/latest.json
World gold price: https://api.gold-api.com/price/XAU


Get THB from: https://cdn.moneyconvert.net/api/latest.json
Buy rates: 67.45 * 1.8887 = 127.48 MMK
Sell rates: 67.45 * 1.9381 = 130.68 MMK

find 1 USD to MMK rates also.

THB Cross Rate ဖြင့် တွက်ချက်ခြင်း

1 USD = 2100 MMK (example rate, please verify with actual data)

2098.68 / 67.45 = 31.11460340993328 

31.13 * 127.48 = 3962.36 MMK (Buy rates for USD to MMK)
31.13 * 130.68 = 4067.34 MMK (Sell rates for USD to MMK)


New update UI:

I want to update the UI design for home, history pages.

UI/001. world gold UI.jpg ,UI/001. myanmar gold UI.jpg are the gold price pages for world gold and myanmar gold respectively.

UI/002. currecy UI.jpg is the main currency page for exchange rates CRUD operations.

UI/003. currency and gold history.jpg is the history page for both currency and gold.


Supported currencies: https://forex.cbm.gov.mm/api/currencies

I want to add date and time picker when adding data.

I want a function to generate daily exchange rates and world gold price automatically at midnight or from admin panel.

here is the logic to calculate exchange rates:

  Get MMK Pric (2100.08320023) from: https://cdn.moneyconvert.net/api/latest.json
  Black maret buy multiplier: 1.8887
  Black market sell multiplier: 1.9381

  For USD to MMK rates:
  Buy rates: 2100.08320023 * 1.8887 = 3962.36 MMK
  Sell rates: 2100.08320023 * 1.9381 = 4070.1712503657627 MMK

  For THB to MMK rates:
  get THB (31.4016824) from: https://cdn.moneyconvert.net/api/latest.json

  Buy rates: (Mynamr buy rates) 3962.36 / 31.4016824 = 126.19 MMK
  Sell rates: (Myanmar sell rates) 4070.1712503657627 / 31.4016824 = 129.68 MMK

  For EUR to MMK rates:
  get EUR (0.85557888) from: https://cdn.moneyconvert.net/api/latest.json

  Buy rates: 3962.36 / 0.85557888 = 4631.96 MMK
  Sell rates: 4070.1712503657627 / 0.85557888 = 4758.76 MMK


For World Gold Price:
  Get World gold price (XAU) from: https://api.gold-api.com/price/XAU

myanamr gold price calculation logic:
  16 PeYe ( old ) multiplier: 1.875
  16 PeYe ( new ) multiplier: 1.905

  Get USD to MMK sell rates (4070.1712503657627 MMK) 
  get World gold price (XAU) (4836.399902 USD) from: https://api.gold-api.com/price/XAU

  Myanmar gold price (16 PeYe old) = 4836.399902( world gold ) / 1.875 * 4070.1712503657627 = 10505136.85 MMK 

  Myanmar gold price (16 PeYe new) = 4836.399902( world gold ) / 1.905 * 4070.1712503657627 = 10337745.03 MMK


  Myanmar gold price (15 PeYe old) = 10505136.85 / 17 * 16 = 9882492.99 MMK
  Myanmar gold price (15 PeYe new) = 10337745.03 / 17 * 16 = 9729705.31 MMK