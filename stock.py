{
 "cells": [
  {
   "cell_type": "markdown",
   "id": "a3f96001",
   "metadata": {},
   "source": [
    "# 📈 توصيات لحظية للأسهم باستخدام GPT وبيانات Alpha Vantage\n",
    "هذا المشروع يستخدم بيانات السوق الحقيقية ويحللها باستخدام GPT لإعطاء توصيات فنية لحظية.\n"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "id": "f7fc58e3",
   "metadata": {},
   "outputs": [],
   "source": [
    "!pip install openai pandas pandas_ta requests ipywidgets --quiet"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "id": "a90bd83e",
   "metadata": {},
   "outputs": [],
   "source": [
    "\n",
    "import openai\n",
    "import requests\n",
    "import pandas as pd\n",
    "import pandas_ta as ta\n",
    "import ipywidgets as widgets\n",
    "from IPython.display import display\n"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "id": "ffec5456",
   "metadata": {},
   "outputs": [],
   "source": [
    "\n",
    "# 🔐 أدخل مفاتيحك هنا\n",
    "openai.api_key = \"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\"\n",
    "alpha_vantage_key = \"X5QLR930PG6ONM5H\"\n"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "id": "a672e43d",
   "metadata": {},
   "outputs": [],
   "source": [
    "\n",
    "def get_stock_data(symbol):\n",
    "    url = f\"https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval=5min&apikey={alpha_vantage_key}&outputsize=compact\"\n",
    "    res = requests.get(url)\n",
    "    data = res.json().get(\"Time Series (5min)\")\n",
    "    if data is None:\n",
    "        raise ValueError(\"لم يتم العثور على بيانات. تحقق من رمز السهم أو المفتاح.\")\n",
    "    df = pd.DataFrame(data).T.astype(float)\n",
    "    df.index = pd.to_datetime(df.index)\n",
    "    df = df.sort_index()\n",
    "    return df\n"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "id": "693da8b4",
   "metadata": {},
   "outputs": [],
   "source": [
    "\n",
    "def get_rsi(df):\n",
    "    df['rsi'] = ta.rsi(df['4. close'], length=14)\n",
    "    return df['rsi'].iloc[-1]\n"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "id": "21419206",
   "metadata": {},
   "outputs": [],
   "source": [
    "\n",
    "def generate_ai_recommendation(symbol):\n",
    "    df = get_stock_data(symbol)\n",
    "    latest_price = df['4. close'].iloc[-1]\n",
    "    rsi = get_rsi(df)\n",
    "    volume = df['5. volume'].iloc[-1]\n",
    "\n",
    "    prompt = f\"\"\"\n",
    "    أعطني توصية لحظية عن سهم {symbol} بناءً على:\n",
    "    - السعر: {latest_price:.2f}\n",
    "    - RSI: {rsi:.2f}\n",
    "    - حجم التداول: {volume}\n",
    "    \"\"\"\n",
    "\n",
    "    response = openai.ChatCompletion.create(\n",
    "        model=\"gpt-4\",\n",
    "        messages=[\n",
    "            {\"role\": \"system\", \"content\": \"أنت محلل فني للأسهم تعطي توصيات سريعة ودقيقة.\"},\n",
    "            {\"role\": \"user\", \"content\": prompt}\n",
    "        ]\n",
    "    )\n",
    "\n",
    "    return response['choices'][0]['message']['content']\n"
   ]
  },
  {
   "cell_type": "markdown",
   "id": "55c2f25c",
   "metadata": {},
   "source": [
    "## 🧑‍💻 واجهة المستخدم"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "id": "b5b12b22",
   "metadata": {},
   "outputs": [],
   "source": [
    "\n",
    "# واجهة المستخدم التفاعلية داخل Colab\n",
    "symbol_input = widgets.Text(\n",
    "    value='TSLA',\n",
    "    placeholder='أدخل رمز السهم مثل TSLA أو AAPL',\n",
    "    description='🧾 السهم:',\n",
    "    disabled=False\n",
    ")\n",
    "\n",
    "button = widgets.Button(description=\"🔍 احصل على التوصية\")\n",
    "output = widgets.Output()\n",
    "\n",
    "def on_button_click(b):\n",
    "    with output:\n",
    "        output.clear_output()\n",
    "        symbol = symbol_input.value.upper()\n",
    "        print(\"⏳ جاري تحليل السهم:\", symbol)\n",
    "        try:\n",
    "            print(generate_ai_recommendation(symbol))\n",
    "        except Exception as e:\n",
    "            print(\"❌ خطأ:\", e)\n",
    "\n",
    "button.on_click(on_button_click)\n",
    "\n",
    "display(symbol_input, button, output)\n"
   ]
  }
 ],
 "metadata": {
  "language_info": {
   "name": "python"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 5
}
