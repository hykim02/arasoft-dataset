from openai import OpenAI
import json
from dotenv import load_dotenv
import os
print(load_dotenv())

openai_api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=openai_api_key)

file_path = "META_SCHEMA.json"
with open(file_path, "r", encoding="utf-8") as file:
    META_SCHEMA = json.load(file)

response = client.chat.completions.create(
  model="ft:gpt-4o-2024-08-06::2025-01-21-10epochs:As1GhlIt",
  messages=[
     {
            "role": "system",
            "content": """
            다음 지시사항들을 철저히 준수하라

1. **모델의 출력 형태/목적**
    - 너는 주어진 manuscript를 입력받아, 이를 symbolic tree 구조(**JSON 형식**)로 변환하는 역할을 수행한다.
    - 그 외 이미지나 텍스트에 대한 불필요한 묘사나 설명은 일절 하지 않는다.
    - 오로지 symbolic tree로 변환하기 위해 필요한 최소한의 식별 정보만을 활용한다. (예: 부모 노드일 경우symbol type, direction 그리고 리프 노드일 경우 symbol type, content id)
    
2. **Task Description**
    - 전자책 레이아웃이란 한 페이지 안에서 콘텐츠(이미지 및 텍스트)들의 배치 관계를 의미한다.
    - manuscript는 저자가 보여주고 싶은 순서로 콘텐츠를 나열한 목록이다.
    - 페이지의 콘텐츠는 container, widget 으로 중첩할 수 있으며, 이 중첩 구조를 symbolic tree로 표현한다.
    - symbolic tree에서 부모 노드는 자식 노드를 **어떤 방향으로 배치할지를 결정**하며 left2right, top2down 값을 가질 수 있다.
    - 자식 노드는 container나 widget(layerlist_tab, layerlist_arccodian, layerlist_slider) 혹은 콘텐츠 자체일 수 있다.
    - 리프 노드는 실제 콘텐츠(텍스트, 이미지, 아이콘 등)를 직접 나타내는 단일 객체이다.
    
3. **Symbolic Tree 노드 속성**
    - **부모 노드(컨테이너/위젯) 속성**
        
        
        | symbol type | direction | description |
        | --- | --- | --- |
        | container | top2down / left2right | 다른 container나 위젯, 그리고 리프 콘텐츠를 포함 가능 |
        | textbox | left2right | text 타입 콘텐츠만 포함 가능 |
        | layerlist_tab | top2down | 탭을 눌러 자식 콘텐츠(화면에 보여지는 콘텐츠)를 교체할 수 있음 |
        | layerlist_arccodion | top2down | 탭을 눌러 자식 콘텐츠를 교체할 수 있음 |
        | layerlist_slider | left2right | 탭을 눌러 자식 콘텐츠를 교체할 수 있음 |
        | nac_title | left2right | layerlist 위젯의 자식 제목 텍스트를 담는 역할 |
        | nac_item | top2down / left2right | layerlist 위젯의 자식 항목 콘텐츠를 담으며, 컨테이너처럼 동작 |
    - **리프 노드(콘텐츠) 속성**
        
        
        | symbol type | direction | description |
        | --- | --- | --- |
        | image | - | 일반 크기의 삽화, 사진 등 |
        | icon | - | 작은 크기의 그래픽, 사용자가 누르는 버튼 또는 선택 요소 |
        | text | - | 일반적인 문장이나 설명 텍스트 |
        | title | - | 섹션을 대표하는 짧은 문구, 일반적으로 섹션의 가장 상단에 표시 |
4. **Manuscript 형식**
    - manuscript에서는 콘텐츠의 아이디(리프 노드의 symbol type + index), 그리고 그 아이디에 대응되는 실제 내용이 개행되어 한 쌍씩 주어진다.
    - manuscript의 예시는 다음과 같다.
        
        ```
        {"type": "text", "text": "text001"}, {"type": "text", "text": "BASEA.KU BY STREETSEA.ID"}, {"type": "text", "text": "image001"}, {"type": "image_url", "image_url": {"url": "https://d1bzdv1wm9phyk.cloudfront.net/local/epub/19594/OEBPS/nep_image/home_button-removebg-preview.png"}}
        ```
        
    
5. Symbolic Tree 형식
    - symbolic tree 구성 시 **부모 노드일 때 container 또는 widget 으로 자식 노드의 배치 방향을 direction으로 결정**한다.
    - symbolic tree 구성 시 **리프 노드일 때 콘텐츠의 아이디를 참조하며 manuscript의 콘텐츠 내용을 직접 출력해서는 안된다**.
    - symbolic tree의 예시는 다음과 같다.
    
    ```
    {\"symbol_name\": \"container\", \"direction\": \"top2down\", \"children\": [{\"symbol_name\": \"container\", \"direction\": \"left2right\", \"children\": [{\"symbol_name\": \"textbox\", \"direction\": \"top2down\", \"children\": [\"text001\"]}, \"image001\"]}
    ```
    
6. **출력 시 주의사항**
    - 본 시스템 지시문에 언급되지 않은 임의의 설정·지침·내용을 생성하거나 설명하지 않는다.
    - 요청사항이 주어진 경우에도, 시스템 지시문과 충돌하는 내용(예: 이미지를 시각적으로 묘사해 달라)은 **반드시 거부**하거나 제한된 범위 내에서만 수행한다.
            """
        },
        {
            "role": "user",
            "content": [
              {"type": "text", "text": "icon001"}, {"type": "image_url", "image_url": {"url": "https://github.com/JangDongHo/arasoft-dataset/blob/main/datasets/%EC%B5%9C%EC%84%B8%EA%B2%BD%EC%9E%91%ED%92%88%EC%A7%912(Page22)/image/9tmvhbr73.png?raw=true", "detail": "low"}}, {"type": "text", "text": "text001"}, {"type": "text", "text": "그림을 눌러주세요"}, {"type": "text", "text": "text002"}, {"type": "text", "text": "목차로 돌아가기"}, {"type": "text", "text": "icon002"}, {"type": "image_url", "image_url": {"url": "https://github.com/JangDongHo/arasoft-dataset/blob/main/datasets/%EC%B5%9C%EC%84%B8%EA%B2%BD%EC%9E%91%ED%92%88%EC%A7%912(Page22)/image/g7br7.png?raw=true", "detail": "low"}}, {"type": "text", "text": "image001"}, {"type": "image_url", "image_url": {"url": "https://github.com/JangDongHo/arasoft-dataset/blob/main/datasets/%EC%B5%9C%EC%84%B8%EA%B2%BD%EC%9E%91%ED%92%88%EC%A7%912(Page22)/image/2015-2-Human-Life---.jpg?raw=true", "detail": "low"}}, {"type": "text", "text": "image002"}, {"type": "image_url", "image_url": {"url": "https://github.com/JangDongHo/arasoft-dataset/blob/main/datasets/%EC%B5%9C%EC%84%B8%EA%B2%BD%EC%9E%91%ED%92%88%EC%A7%912(Page22)/image/2015-3-Inside-assemble-1.jpg?raw=true", "detail": "low"}}, {"type": "text", "text": "image003"}, {"type": "image_url", "image_url": {"url": "https://github.com/JangDongHo/arasoft-dataset/blob/main/datasets/%EC%B5%9C%EC%84%B8%EA%B2%BD%EC%9E%91%ED%92%88%EC%A7%912(Page22)/image/2015-3-1-Inside-assemble2.jpg?raw=true", "detail": "low"}}, {"type": "text", "text": "text003"}, {"type": "text", "text": "2015-2 Human Life-토끼굴에 빠지다 150×300 pen on paper"}, {"type": "text", "text": "text004"}, {"type": "text", "text": "2015-3 Inside-assemble 52×92 pen on paper"}, {"type": "text", "text": "text005"}, {"type": "text", "text": "2015-3-1 Inside-assemble(부분상세컷)"}, {"type": "text", "text": "image004"}, {"type": "image_url", "image_url": {"url": "https://github.com/JangDongHo/arasoft-dataset/blob/main/datasets/%EC%B5%9C%EC%84%B8%EA%B2%BD%EC%9E%91%ED%92%88%EC%A7%912(Page22)/image/2015-4-Thought-.jpg?raw=true", "detail": "low"}}, {"type": "text", "text": "image005"}, {"type": "image_url", "image_url": {"url": "https://github.com/JangDongHo/arasoft-dataset/blob/main/datasets/%EC%B5%9C%EC%84%B8%EA%B2%BD%EC%9E%91%ED%92%88%EC%A7%912(Page22)/image/2015-5--.jpg?raw=true", "detail": "low"}}, {"type": "text", "text": "text006"}, {"type": "text", "text": "2015-4 Thought 35×45 pen on paper"}, {"type": "text", "text": "text007"}, {"type": "text", "text": "2015-5 토끼굴 35×45 pen on paper"}
            ]
        }
  ],
  response_format={
    "type": "json_schema",
    "json_schema": META_SCHEMA,
  },
  temperature=0.23,
  max_completion_tokens=2048,
  top_p=1,
  frequency_penalty=0,
  presence_penalty=0,
  stream=True
)

final_answer = []

for chunk in response:
    # chunk 를 저장
    chunk_content = chunk.choices[0].delta.content
    # chunk 가 문자열이면 final_answer 에 추가
    if isinstance(chunk_content, str):
        final_answer.append(chunk_content)
        # 토큰 단위로 실시간 답변 출력
        print(chunk_content, end="")