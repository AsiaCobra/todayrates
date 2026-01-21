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
Daily exchange rates: https://forex.cbm.gov.mm/api/latest,https://cdn.moneyconvert.net/api/latest.json
World gold price: https://api.gold-api.com/price/XAU


Get THB from: https://forex.cbm.gov.mm/api/latest
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