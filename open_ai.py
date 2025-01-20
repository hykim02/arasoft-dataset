from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()
client = OpenAI()

response = client.chat.completions.create(
  model="ft:gpt-4o-2024-08-06:personal:2025-01-20-test3:ArhimoFG",
  messages=[
     {
            "role": "system",
            "content": "You should convert from manuscript to symbolic tree."
        },
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "text_001"},
                {"type": "text", "text": "목차로 돌아가기"}
            ]
        },
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "text_002"},
                {"type": "text", "text": "추천일정"}
            ]
        },
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "text_003"},
                {"type": "text", "text": "1박2일 코스"}
            ]
        },
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "img_001"},
                {"type": "image_url", "image_url": {"url": "https://d1bzdv1wm9phyk.cloudfront.net/local/epub/19142/OEBPS/nep_image/1.png"}}
            ]
        },
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "text_004"},
                {"type": "text", "text": "2박3일 코스"}
            ]
        },
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "img_002"},
                {"type": "image_url", "image_url": {"url": "https://d1bzdv1wm9phyk.cloudfront.net/local/epub/19142/OEBPS/nep_image/2.png"}}
            ]
        },
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "text_005"},
                {"type": "text", "text": "3박4일 코스"}
            ]
        },
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "img_003"},
                {"type": "image_url", "image_url": {"url": "https://d1bzdv1wm9phyk.cloudfront.net/local/epub/19142/OEBPS/nep_image/3.png"}}
            ]
        },
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "text_006"},
                {"type": "text", "text": "자투리 시간 코스"}
            ]
        },
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "img_004"},
                {"type": "image_url", "image_url": {"url": "https://d1bzdv1wm9phyk.cloudfront.net/local/epub/19142/OEBPS/nep_image/4.png"}}
            ]
        },
  ],
  response_format={
    "type": "text"
  },
  temperature=1,
  max_completion_tokens=2048,
  top_p=1,
  frequency_penalty=0,
  presence_penalty=0
)

print(response)