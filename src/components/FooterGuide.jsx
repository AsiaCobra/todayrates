import { useState } from 'react'

export default function FooterGuide() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mt-12 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700">
          // စျေးနှုန်းတွက်ချက်နည်းအညွှန်း
        </span>
        <span className="text-gray-500 font-mono">
          [{isOpen ? '−' : '+'}]
        </span>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="px-6 py-6 space-y-8 text-sm">
          {/* Section 1 & 2 - Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 01. Formula */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 border-b border-amber-400 pb-1 inline-block">
                01. ပုံသေနည်း
              </h3>
              <p className="text-gray-600 mb-3">
                မြန်မာ့ရွှေဈေး (အဆင့်မြင့် ၁ ကျပ်သား) တွက်ရန် ပုံသေနည်း
              </p>
              <div className="bg-white border border-gray-200 rounded px-4 py-2 mb-4 font-mono text-amber-700">
                (World Price / 1.875) * Exchange Rate
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex">
                  <span className="text-amber-500 mr-2">•</span>
                  <span>1.875 = ၁ ကျောင်းငွေ = ရွှေတစ် ကျပ်သား (ကိုးမူးဆယ်)</span>
                </li>
                <li className="flex">
                  <span className="text-amber-500 mr-2">•</span>
                  <span>World Price = ကမ္ဘာ့ရွှေဈေး (USD/Oz)</span>
                </li>
                <li className="flex">
                  <span className="text-amber-500 mr-2">•</span>
                  <span>Exchange Rate = ဒေါ်လာငွေလဲနှုန်း (MMK)</span>
                </li>
              </ul>
            </div>

            {/* 02. Weight Conversion */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 border-b border-amber-400 pb-1 inline-block">
                02. ထုထည်ပြောင်းလဲပုံ
              </h3>
              <p className="text-gray-600 mb-3">
                ဒေါင်း (Troy Ounce) နှင့် ကျပ်သား ပြောင်းလဲ ဇယ် =
              </p>
              <table className="w-full mb-4">
                <tbody className="text-gray-700">
                  <tr className="border-b border-gray-200">
                    <td className="py-2">1 Troy Ounce</td>
                    <td className="py-2 text-right font-mono">31.1035 g</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2">၁ ကျပ်သား</td>
                    <td className="py-2 text-right font-mono">16.606 g</td>
                  </tr>
                </tbody>
              </table>
              <div className="bg-white border border-gray-200 rounded px-4 py-2 font-mono text-gray-600 text-center">
                31.1035 ÷ 16.606 = 1.875
              </div>
            </div>
          </div>

          {/* 03. Dollar Price Spread */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 border-b border-amber-400 pb-1 inline-block">
              03. ဒေါ်လာဈေးပြန့်ပွားမှု
            </h3>
            <p className="text-gray-600 mb-3">
              တကယ် မြန်မာ့ရွှေ စျေးကိုကနေ ကမ္ဘာ့ရွှေဈေးအရ အမြတ်ငွေဘယ်လောက်ပြန့်ပွားနေပုံကို သိရှိရန်တွက်နည်း
            </p>
            <div className="bg-white border border-gray-200 rounded px-4 py-2 mb-4 font-mono text-amber-700 inline-block">
              (MMK Gold Price * 1.875) / World Price
            </div>
            <ul className="space-y-2 text-gray-600">
              <li className="flex">
                <span className="text-amber-500 mr-2">•</span>
                <span>မြန်မာ့ဒေါ်လာ အတက်အကျကြောင့် အချိန်နှင့်အမျှပြောင်းလဲမှုရှိနိုင်ပါသည်</span>
              </li>
              <li className="flex">
                <span className="text-amber-500 mr-2">•</span>
                <span>ရွှေဈေးနှင့် ဒေါ်လာဈေးကြား (Gap) တွင် ဝယ်လိုအင်နှင့် အရောင်းပိုင်ဆိုင်</span>
              </li>
            </ul>
          </div>

          {/* Note Section */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-gray-700">
              <span className="font-bold text-amber-700">// မှတ်ချက်</span>
              <br />
              ကျွန်ုပ်တို့ဖော်ပြချက် (24K/99.9%) အတိုင်း အင်္ဂလိပ်စာနှင့်သာ ပြင်ဆင်ထား၍
              တိကျစေရာတွင်ငှင့် စည်းကမ်းတစ်စိတ်မျှသာဖြစ်ပြီး ရောက်ရောက်ရာဒေသစျေးကွက်ပေါ်မူတည်၍
              ကွဲပြားနိုင်ပြီ အချိန်နှင့်တစ် စာပြင်ရပါသည်။
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
