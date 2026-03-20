# 幫媽媽在線買票「員林→溪頭」的使用者故事

媽媽年紀大行動不便也不會上網，希望幫他自動買票。以下的說明是我找到可以協助你的資料希望有幫助，生成如同 bc-cch-hospital/booking.js 一樣可以自動買票。我們需要買的票是「員林→溪頭」，但以後也許會有其它票。把「填寫乘客資料」也做成全自動。

## 買票頁面

https://kktix.com/events?utf8=%E2%9C%93&search=溪頭&max_price=&min_price=&start_at=2026%2F02%2F09&end_at=&event_tag_ids_in=

## keywords

"員林→溪頭"

## 買票列表頁面

「員林→溪頭」的買票列表頁面，這個頁面將買票的資料都放在 "data-react-props" 屬性，內容是JSON格式， data 屬性可以取得買票信息，也可以由頁面源代碼取得「員林→溪頭」的買票項目。

```html
<div
  data-react-class="SearchWrapper"
  data-react-props='{"data":[{"id":120943,"slug":"951cddb2","type":"event","show_capacity":false,"category_name":"戶外","kkbox_event":false,"name":"【9路】02/09 (一)  08:00 彰化→溪頭","start_at":1770595200,"register_status":"CLOSED","register_intent_status":"NOT_APPLICABLE","public_url":"https://changhuabus.kktix.cc/events/951cddb2","description_summary":"注意事項： \t請務必於發車前10分鐘至車站報到，逾時將由現場候位乘客替補，並請您改為現場候位。 \t 超過3次未依規定時間報到者，將列為黑名單，不再提供預約服務。(已訂票之黑名單，將於發車前一日由系統自","og_image_url":"https://assets.kktix.io/upload_images/291577/0800%E5%BD%B0_0_medium.jpg","first_sale_at":null,"register_intent_start_at":null,"attendees_count":null,"kkpoint_magnification":false,"venue_type":"physic_venue","virtual_venue":{}},{"id":120942,"slug":"c06565e5","type":"event","show_capacity":false,"category_name":"戶外","kkbox_event":false,"name":"【9路】02/09 (一)  07:40 彰化→溪頭","start_at":1770594000,"register_status":"CLOSED","register_intent_status":"NOT_APPLICABLE","public_url":"https://changhuabus.kktix.cc/events/c06565e5","description_summary":"注意事項： \t請務必於發車前10分鐘至車站報到，逾時將由現場候位乘客替補，並請您改為現場候位。 \t 超過3次未依規定時間報到者，將列為黑名單，不再提供預約服務。(已訂票之黑名單，將於發車前一日由系統自","og_image_url":"https://assets.kktix.io/upload_images/291576/0740%E5%BD%B0_0_medium.jpg","first_sale_at":null,"register_intent_start_at":null,"attendees_count":null,"kkpoint_magnification":false,"venue_type":"physic_venue","virtual_venue":{}},{"id":120941,"slug":"08b49c04","type":"event","show_capacity":false,"category_name":"戶外","kkbox_event":false,"name":"【10路】02/09 (一)  07:40 員林→溪頭","start_at":1770594000,"register_status":"CLOSED","register_intent_status":"NOT_APPLICABLE","public_url":"https://changhuabus.kktix.cc/events/08b49c04","description_summary":"注意事項： \t請務必於發車前10分鐘至車站報到，逾時將由現場候位乘客替補，並請您改為現場候位。 \t 超過3次未依規定時間報到者，將列為黑名單，不再提供預約服務。(已訂票之黑名單，將於發車前一日由系統自","og_image_url":"https://assets.kktix.io/upload_images/291575/0740%E5%93%A1_0_medium.jpg","first_sale_at":null,"register_intent_start_at":null,"attendees_count":null,"kkpoint_magnification":false,"venue_type":"physic_venue","virtual_venue":{}},{"id":120939,"slug":"eb645ec1","type":"event","show_capacity":false,"category_name":"戶外","kkbox_event":false,"name":"【10路】02/09 (一)  07:20 員林→溪頭","start_at":1770592800,"register_status":"CLOSED","register_intent_status":"NOT_APPLICABLE","public_url":"https://changhuabus.kktix.cc/events/eb645ec1","description_summary":"注意事項： \t請務必於發車前10分鐘至車站報到，逾時將由現場候位乘客替補，並請您改為現場候位。 \t 超過3次未依規定時間報到者，將列為黑名單，不再提供預約服務。(已訂票之黑名單，將於發車前一日由系統自","og_image_url":"https://assets.kktix.io/upload_images/291569/0720%E5%93%A1_0_medium.jpg","first_sale_at":null,"register_intent_start_at":null,"attendees_count":null,"kkpoint_magnification":false,"venue_type":"physic_venue","virtual_venue":{}},{"id":120933,"slug":"a0be787a","type":"event","show_capacity":false,"category_name":"戶外","kkbox_event":false,"name":"【9路】02/09 (一)  07:20 彰化→溪頭","start_at":1770592800,"register_status":"CLOSED","register_intent_status":"NOT_APPLICABLE","public_url":"https://changhuabus.kktix.cc/events/a0be787a","description_summary":"注意事項： \t請務必於發車前10分鐘至車站報到，逾時將由現場候位乘客替補，並請您改為現場候位。 \t 超過3次未依規定時間報到者，將列為黑名單，不再提供預約服務。(已訂票之黑名單，將於發車前一日由系統自","og_image_url":"https://assets.kktix.io/upload_images/291535/0720%E5%BD%B0_0_medium.jpg","first_sale_at":null,"register_intent_start_at":null,"attendees_count":null,"kkpoint_magnification":false,"venue_type":"physic_venue","virtual_venue":{}},{"id":120940,"slug":"eb645ec1-copy-1","type":"event","show_capacity":false,"category_name":"戶外","kkbox_event":false,"name":"【10A路】02/09 (一)  07:30 溪湖→溪頭(限溪湖上車)","start_at":1770593400,"register_status":"CLOSED","register_intent_status":"NOT_APPLICABLE","public_url":"https://changhuabus.kktix.cc/events/eb645ec1-copy-1","description_summary":"注意事項： \t請務必於發車前10分鐘至車站報到，逾時將由現場候位乘客替補，並請您改為現場候位。 \t 超過3次未依規定時間報到者，將列為黑名單，不再提供預約服務。(已訂票之黑名單，將於發車前一日由系統自","og_image_url":"https://assets.kktix.io/upload_images/291571/0730%E6%BA%AA%E6%B9%96_0_medium.jpg","first_sale_at":null,"register_intent_start_at":null,"attendees_count":null,"kkpoint_magnification":false,"venue_type":"physic_venue","virtual_venue":{}},{"id":120936,"slug":"a0be787a-copy-1","type":"event","show_capacity":false,"category_name":"戶外","kkbox_event":false,"name":"【9A路】02/09 (一)  07:00 鹿港→溪頭(限鹿港上車)","start_at":1770591600,"register_status":"CLOSED","register_intent_status":"NOT_APPLICABLE","public_url":"https://changhuabus.kktix.cc/events/a0be787a-copy-1","description_summary":"注意事項： \t請務必於發車前10分鐘至車站報到，逾時將由現場候位乘客替補，並請您改為現場候位。 \t 超過3次未依規定時間報到者，將列為黑名單，不再提供預約服務。(已訂票之黑名單，將於發車前一日由系統自","og_image_url":"https://assets.kktix.io/upload_images/291565/0700%E9%B9%BF_0_medium.jpg","first_sale_at":null,"register_intent_start_at":null,"attendees_count":null,"kkpoint_magnification":false,"venue_type":"physic_venue","virtual_venue":{}},{"id":120998,"slug":"2e9742ca","type":"event","show_capacity":false,"category_name":"戶外","kkbox_event":false,"name":"【9路】02/10 (二)  08:00 彰化→溪頭","start_at":1770681600,"register_status":"IN_STOCK","register_intent_status":"NOT_APPLICABLE","public_url":"https://changhuabus.kktix.cc/events/2e9742ca","description_summary":"注意事項： \t請務必於發車前10分鐘至車站報到，逾時將由現場候位乘客替補，並請您改為現場候位。 \t 超過3次未依規定時間報到者，將列為黑名單，不再提供預約服務。(已訂票之黑名單，將於發車前一日由系統自","og_image_url":"https://assets.kktix.io/upload_images/291706/0800%E5%BD%B0_0_medium.jpg","first_sale_at":null,"register_intent_start_at":null,"attendees_count":null,"kkpoint_magnification":false,"venue_type":"physic_venue","virtual_venue":{}},{"id":120973,"slug":"3e76d622","type":"event","show_capacity":false,"category_name":"戶外","kkbox_event":false,"name":"【10路】02/10 (二)  07:20 員林→溪頭","start_at":1770679200,"register_status":"IN_STOCK","register_intent_status":"NOT_APPLICABLE","public_url":"https://changhuabus.kktix.cc/events/3e76d622","description_summary":"注意事項： \t請務必於發車前10分鐘至車站報到，逾時將由現場候位乘客替補，並請您改為現場候位。 \t 超過3次未依規定時間報到者，將列為黑名單，不再提供預約服務。(已訂票之黑名單，將於發車前一日由系統自","og_image_url":"https://assets.kktix.io/upload_images/291688/0720%E5%93%A1_0_medium.jpg","first_sale_at":null,"register_intent_start_at":null,"attendees_count":null,"kkpoint_magnification":false,"venue_type":"physic_venue","virtual_venue":{}},{"id":120951,"slug":"95dca658","type":"event","show_capacity":false,"category_name":"戶外","kkbox_event":false,"name":"【9路】02/10 (二)  07:20 彰化→溪頭","start_at":1770679200,"register_status":"SOLD_OUT","register_intent_status":"NOT_APPLICABLE","public_url":"https://changhuabus.kktix.cc/events/95dca658","description_summary":"注意事項： \t請務必於發車前10分鐘至車站報到，逾時將由現場候位乘客替補，並請您改為現場候位。 \t 超過3次未依規定時間報到者，將列為黑名單，不再提供預約服務。(已訂票之黑名單，將於發車前一日由系統自","og_image_url":"https://assets.kktix.io/upload_images/291641/0720%E5%BD%B0_0_medium.jpg","first_sale_at":null,"register_intent_start_at":null,"attendees_count":null,"kkpoint_magnification":false,"venue_type":"physic_venue","virtual_venue":{}},{"id":120996,"slug":"462b4055","type":"event","show_capacity":false,"category_name":"戶外","kkbox_event":false,"name":"【10路】02/10 (二)  07:40 員林→溪頭","start_at":1770680400,"register_status":"SOLD_OUT","register_intent_status":"NOT_APPLICABLE","public_url":"https://changhuabus.kktix.cc/events/462b4055","description_summary":"注意事項： \t請務必於發車前10分鐘至車站報到，逾時將由現場候位乘客替補，並請您改為現場候位。 \t 超過3次未依規定時間報到者，將列為黑名單，不再提供預約服務。(已訂票之黑名單，將於發車前一日由系統自","og_image_url":"https://assets.kktix.io/upload_images/291699/0740%E5%93%A1_0_medium.jpg","first_sale_at":null,"register_intent_start_at":null,"attendees_count":null,"kkpoint_magnification":false,"venue_type":"physic_venue","virtual_venue":{}},{"id":120997,"slug":"c267d5bb","type":"event","show_capacity":false,"category_name":"戶外","kkbox_event":false,"name":"【9路】02/10 (二)  07:40 彰化→溪頭","start_at":1770680400,"register_status":"IN_STOCK","register_intent_status":"NOT_APPLICABLE","public_url":"https://changhuabus.kktix.cc/events/c267d5bb","description_summary":"注意事項： \t請務必於發車前10分鐘至車站報到，逾時將由現場候位乘客替補，並請您改為現場候位。 \t 超過3次未依規定時間報到者，將列為黑名單，不再提供預約服務。(已訂票之黑名單，將於發車前一日由系統自","og_image_url":"https://assets.kktix.io/upload_images/291704/0740%E5%BD%B0_0_medium.jpg","first_sale_at":null,"register_intent_start_at":null,"attendees_count":null,"kkpoint_magnification":false,"venue_type":"physic_venue","virtual_venue":{}}],"locale":"zh-TW","i18n_text":{"enrich_your_activities":"讓精彩活動豐富你的每日行事曆","focused_event_header":"焦點活動","featured_event_header":"特色活動","comming_event_header":"即將來臨","available_in":"%{interval}後開賣","register_intent_available_in":"%{interval}後開放登記","in_stock":"開賣中","register_intent_available":"開放登記","closed":"已結束","view_event":"檢視活動","coming_soon":"敬請期待","attendees_count":"%{count}人參加活動","explore_events":"探索更多活動","search_events_by_interest":"你也可以依你的興趣找活動","kktix_app":"KKTIX APP ，玩轉活動在手中!","kktix_app_line":"最方便的跨平台售票服務，用手機看也通。即使人在捷運、公車上，也能順利完成報名。","follow_event":"關注的活動帶著走","qr_code_line_1":"","qr_code":"電子QR Code","qr_code_line_2":"票券管理一把罩","create_event":"建立你的活動","create_event_line_1":"KKTIX滿足你舉辦活動的各項需求，從建立、管理、行銷到售票一把罩，","create_event_line_2":"舉辦免費活動永遠免費。","organizer_page":"主辦單位專區","kkbox_members_only":"KK ID 會員限定","venue_partners":"合作場館","tickets_left":"剩%{count}張票","find_event_by_category_1":"依興趣","find_event_by_category_2":"找活動","more_category_1":"更多","more_category_2":"分類"}}'
  data-hydrate="t"
  data-react-cache-id="SearchWrapper-0"
>
  <div data-reactroot="">
    <ul class="events clearfix">
      <li class="type-closed">
        <a href="https://changhuabus.kktix.cc/events/951cddb2" class="cover"
          ><figure>
            <img
              alt=""
              src="https://assets.kktix.io/upload_images/291577/0800%E5%BD%B0_0_medium.jpg"
            />
            <figcaption>
              <span class="category"
                ><i class="fa fa-th-list"></i>
                <!-- -->戶外</span
              >
              <div class="info">
                <div class="info-inner">
                  <div class="info-content">
                    <div class="event-title">
                      <h2>【9路】02/09 (一) 08:00 彰化→溪頭</h2>
                    </div>
                    <div class="introduction">
                      <p>
                        注意事項：
                        請務必於發車前10分鐘至車站報到，逾時將由現場候位乘客替補，並請您改為現場候位。
                        超過3次未依規定時間報到者，將列為黑名單，不再提供預約服務。(已訂票之黑名單，將於發車前一日由系統自
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <ul class="groups clearfix"></ul>
            </figcaption>
          </figure>
          <div class="ft clearfix">
            <span class="date"
              ><i class="fa fa-calendar"></i>
              <!-- -->2026/2/9<span class="minor"
                >(<!-- -->一<!-- -->)</span
              ></span
            ><span class="fake-btn pull-right"
              >已結束<!-- -->
              <i class="fa fa-angle-right"></i
            ></span></div
        ></a>
      </li>
      <li class="type-closed">
        <a href="https://changhuabus.kktix.cc/events/c06565e5" class="cover"
          ><figure>
            <img
              alt=""
              src="https://assets.kktix.io/upload_images/291576/0740%E5%BD%B0_0_medium.jpg"
            />
            <figcaption>
              <span class="category"
                ><i class="fa fa-th-list"></i>
                <!-- -->戶外</span
              >
              <div class="info">
                <div class="info-inner">
                  <div class="info-content">
                    <div class="event-title">
                      <h2>【9路】02/09 (一) 07:40 彰化→溪頭</h2>
                    </div>
                    <div class="introduction">
                      <p>
                        注意事項：
                        請務必於發車前10分鐘至車站報到，逾時將由現場候位乘客替補，並請您改為現場候位。
                        超過3次未依規定時間報到者，將列為黑名單，不再提供預約服務。(已訂票之黑名單，將於發車前一日由系統自
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <ul class="groups clearfix"></ul>
            </figcaption>
          </figure>
          <div class="ft clearfix">
            <span class="date"
              ><i class="fa fa-calendar"></i>
              <!-- -->2026/2/9<span class="minor"
                >(<!-- -->一<!-- -->)</span
              ></span
            ><span class="fake-btn pull-right"
              >已結束<!-- -->
              <i class="fa fa-angle-right"></i
            ></span></div
        ></a>
      </li>
      <li class="type-closed">
        <a href="https://changhuabus.kktix.cc/events/08b49c04" class="cover"
          ><figure>
            <img
              alt=""
              src="https://assets.kktix.io/upload_images/291575/0740%E5%93%A1_0_medium.jpg"
            />
            <figcaption>
              <span class="category"
                ><i class="fa fa-th-list"></i>
                <!-- -->戶外</span
              >
              <div class="info">
                <div class="info-inner">
                  <div class="info-content">
                    <div class="event-title">
                      <h2>【10路】02/09 (一) 07:40 員林→溪頭</h2>
                    </div>
                    <div class="introduction">
                      <p>
                        注意事項：
                        請務必於發車前10分鐘至車站報到，逾時將由現場候位乘客替補，並請您改為現場候位。
                        超過3次未依規定時間報到者，將列為黑名單，不再提供預約服務。(已訂票之黑名單，將於發車前一日由系統自
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <ul class="groups clearfix"></ul>
            </figcaption>
          </figure>
          <div class="ft clearfix">
            <span class="date"
              ><i class="fa fa-calendar"></i>
              <!-- -->2026/2/9<span class="minor"
                >(<!-- -->一<!-- -->)</span
              ></span
            ><span class="fake-btn pull-right"
              >已結束<!-- -->
              <i class="fa fa-angle-right"></i
            ></span></div
        ></a>
      </li>
      <li class="type-closed">
        <a href="https://changhuabus.kktix.cc/events/eb645ec1" class="cover"
          ><figure>
            <img
              alt=""
              src="https://assets.kktix.io/upload_images/291569/0720%E5%93%A1_0_medium.jpg"
            />
            <figcaption>
              <span class="category"
                ><i class="fa fa-th-list"></i>
                <!-- -->戶外</span
              >
              <div class="info">
                <div class="info-inner">
                  <div class="info-content">
                    <div class="event-title">
                      <h2>【10路】02/09 (一) 07:20 員林→溪頭</h2>
                    </div>
                    <div class="introduction">
                      <p>
                        注意事項：
                        請務必於發車前10分鐘至車站報到，逾時將由現場候位乘客替補，並請您改為現場候位。
                        超過3次未依規定時間報到者，將列為黑名單，不再提供預約服務。(已訂票之黑名單，將於發車前一日由系統自
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <ul class="groups clearfix"></ul>
            </figcaption>
          </figure>
          <div class="ft clearfix">
            <span class="date"
              ><i class="fa fa-calendar"></i>
              <!-- -->2026/2/9<span class="minor"
                >(<!-- -->一<!-- -->)</span
              ></span
            ><span class="fake-btn pull-right"
              >已結束<!-- -->
              <i class="fa fa-angle-right"></i
            ></span></div
        ></a>
      </li>
      <li class="type-closed">
        <a href="https://changhuabus.kktix.cc/events/a0be787a" class="cover"
          ><figure>
            <img
              alt=""
              src="https://assets.kktix.io/upload_images/291535/0720%E5%BD%B0_0_medium.jpg"
            />
            <figcaption>
              <span class="category"
                ><i class="fa fa-th-list"></i>
                <!-- -->戶外</span
              >
              <div class="info">
                <div class="info-inner">
                  <div class="info-content">
                    <div class="event-title">
                      <h2>【9路】02/09 (一) 07:20 彰化→溪頭</h2>
                    </div>
                    <div class="introduction">
                      <p>
                        注意事項：
                        請務必於發車前10分鐘至車站報到，逾時將由現場候位乘客替補，並請您改為現場候位。
                        超過3次未依規定時間報到者，將列為黑名單，不再提供預約服務。(已訂票之黑名單，將於發車前一日由系統自
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <ul class="groups clearfix"></ul>
            </figcaption>
          </figure>
          <div class="ft clearfix">
            <span class="date"
              ><i class="fa fa-calendar"></i>
              <!-- -->2026/2/9<span class="minor"
                >(<!-- -->一<!-- -->)</span
              ></span
            ><span class="fake-btn pull-right"
              >已結束<!-- -->
              <i class="fa fa-angle-right"></i
            ></span></div
        ></a>
      </li>
      <li class="type-closed">
        <a
          href="https://changhuabus.kktix.cc/events/eb645ec1-copy-1"
          class="cover"
          ><figure>
            <img
              alt=""
              src="https://assets.kktix.io/upload_images/291571/0730%E6%BA%AA%E6%B9%96_0_medium.jpg"
            />
            <figcaption>
              <span class="category"
                ><i class="fa fa-th-list"></i>
                <!-- -->戶外</span
              >
              <div class="info">
                <div class="info-inner">
                  <div class="info-content">
                    <div class="event-title">
                      <h2>【10A路】02/09 (一) 07:30 溪湖→溪頭(限溪湖上車)</h2>
                    </div>
                    <div class="introduction">
                      <p>
                        注意事項：
                        請務必於發車前10分鐘至車站報到，逾時將由現場候位乘客替補，並請您改為現場候位。
                        超過3次未依規定時間報到者，將列為黑名單，不再提供預約服務。(已訂票之黑名單，將於發車前一日由系統自
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <ul class="groups clearfix"></ul>
            </figcaption>
          </figure>
          <div class="ft clearfix">
            <span class="date"
              ><i class="fa fa-calendar"></i>
              <!-- -->2026/2/9<span class="minor"
                >(<!-- -->一<!-- -->)</span
              ></span
            ><span class="fake-btn pull-right"
              >已結束<!-- -->
              <i class="fa fa-angle-right"></i
            ></span></div
        ></a>
      </li>
      <li class="type-closed">
        <a
          href="https://changhuabus.kktix.cc/events/a0be787a-copy-1"
          class="cover"
          ><figure>
            <img
              alt=""
              src="https://assets.kktix.io/upload_images/291565/0700%E9%B9%BF_0_medium.jpg"
            />
            <figcaption>
              <span class="category"
                ><i class="fa fa-th-list"></i>
                <!-- -->戶外</span
              >
              <div class="info">
                <div class="info-inner">
                  <div class="info-content">
                    <div class="event-title">
                      <h2>【9A路】02/09 (一) 07:00 鹿港→溪頭(限鹿港上車)</h2>
                    </div>
                    <div class="introduction">
                      <p>
                        注意事項：
                        請務必於發車前10分鐘至車站報到，逾時將由現場候位乘客替補，並請您改為現場候位。
                        超過3次未依規定時間報到者，將列為黑名單，不再提供預約服務。(已訂票之黑名單，將於發車前一日由系統自
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <ul class="groups clearfix"></ul>
            </figcaption>
          </figure>
          <div class="ft clearfix">
            <span class="date"
              ><i class="fa fa-calendar"></i>
              <!-- -->2026/2/9<span class="minor"
                >(<!-- -->一<!-- -->)</span
              ></span
            ><span class="fake-btn pull-right"
              >已結束<!-- -->
              <i class="fa fa-angle-right"></i
            ></span></div
        ></a>
      </li>
      <li class="type-selling">
        <a href="https://changhuabus.kktix.cc/events/2e9742ca" class="cover"
          ><figure>
            <img
              alt=""
              src="https://assets.kktix.io/upload_images/291706/0800%E5%BD%B0_0_medium.jpg"
            />
            <figcaption>
              <span class="category"
                ><i class="fa fa-th-list"></i>
                <!-- -->戶外</span
              >
              <div class="info">
                <div class="info-inner">
                  <div class="info-content">
                    <div class="event-title">
                      <h2>【9路】02/10 (二) 08:00 彰化→溪頭</h2>
                    </div>
                    <div class="introduction">
                      <p>
                        注意事項：
                        請務必於發車前10分鐘至車站報到，逾時將由現場候位乘客替補，並請您改為現場候位。
                        超過3次未依規定時間報到者，將列為黑名單，不再提供預約服務。(已訂票之黑名單，將於發車前一日由系統自
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <ul class="groups clearfix"></ul>
            </figcaption>
          </figure>
          <div class="ft clearfix">
            <span class="date"
              ><i class="fa fa-calendar"></i>
              <!-- -->2026/2/10<span class="minor"
                >(<!-- -->二<!-- -->)</span
              ></span
            ><span class="fake-btn pull-right"
              >開賣中<!-- -->
              <i class="fa fa-angle-right"></i
            ></span></div
        ></a>
      </li>
      <li class="type-selling">
        <a href="https://changhuabus.kktix.cc/events/3e76d622" class="cover"
          ><figure>
            <img
              alt=""
              src="https://assets.kktix.io/upload_images/291688/0720%E5%93%A1_0_medium.jpg"
            />
            <figcaption>
              <span class="category"
                ><i class="fa fa-th-list"></i>
                <!-- -->戶外</span
              >
              <div class="info">
                <div class="info-inner">
                  <div class="info-content">
                    <div class="event-title">
                      <h2>【10路】02/10 (二) 07:20 員林→溪頭</h2>
                    </div>
                    <div class="introduction">
                      <p>
                        注意事項：
                        請務必於發車前10分鐘至車站報到，逾時將由現場候位乘客替補，並請您改為現場候位。
                        超過3次未依規定時間報到者，將列為黑名單，不再提供預約服務。(已訂票之黑名單，將於發車前一日由系統自
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <ul class="groups clearfix"></ul>
            </figcaption>
          </figure>
          <div class="ft clearfix">
            <span class="date"
              ><i class="fa fa-calendar"></i>
              <!-- -->2026/2/10<span class="minor"
                >(<!-- -->二<!-- -->)</span
              ></span
            ><span class="fake-btn pull-right"
              >開賣中<!-- -->
              <i class="fa fa-angle-right"></i
            ></span></div
        ></a>
      </li>
      <li class="type-view">
        <a href="https://changhuabus.kktix.cc/events/95dca658" class="cover"
          ><figure>
            <img
              alt=""
              src="https://assets.kktix.io/upload_images/291641/0720%E5%BD%B0_0_medium.jpg"
            />
            <figcaption>
              <span class="category"
                ><i class="fa fa-th-list"></i>
                <!-- -->戶外</span
              >
              <div class="info">
                <div class="info-inner">
                  <div class="info-content">
                    <div class="event-title">
                      <h2>【9路】02/10 (二) 07:20 彰化→溪頭</h2>
                    </div>
                    <div class="introduction">
                      <p>
                        注意事項：
                        請務必於發車前10分鐘至車站報到，逾時將由現場候位乘客替補，並請您改為現場候位。
                        超過3次未依規定時間報到者，將列為黑名單，不再提供預約服務。(已訂票之黑名單，將於發車前一日由系統自
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <ul class="groups clearfix"></ul>
            </figcaption>
          </figure>
          <div class="ft clearfix">
            <span class="date"
              ><i class="fa fa-calendar"></i>
              <!-- -->2026/2/10<span class="minor"
                >(<!-- -->二<!-- -->)</span
              ></span
            ><span class="fake-btn pull-right"
              >檢視活動<!-- -->
              <i class="fa fa-angle-right"></i
            ></span></div
        ></a>
      </li>
      <li class="type-view">
        <a href="https://changhuabus.kktix.cc/events/462b4055" class="cover"
          ><figure>
            <img
              alt=""
              src="https://assets.kktix.io/upload_images/291699/0740%E5%93%A1_0_medium.jpg"
            />
            <figcaption>
              <span class="category"
                ><i class="fa fa-th-list"></i>
                <!-- -->戶外</span
              >
              <div class="info">
                <div class="info-inner">
                  <div class="info-content">
                    <div class="event-title">
                      <h2>【10路】02/10 (二) 07:40 員林→溪頭</h2>
                    </div>
                    <div class="introduction">
                      <p>
                        注意事項：
                        請務必於發車前10分鐘至車站報到，逾時將由現場候位乘客替補，並請您改為現場候位。
                        超過3次未依規定時間報到者，將列為黑名單，不再提供預約服務。(已訂票之黑名單，將於發車前一日由系統自
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <ul class="groups clearfix"></ul>
            </figcaption>
          </figure>
          <div class="ft clearfix">
            <span class="date"
              ><i class="fa fa-calendar"></i>
              <!-- -->2026/2/10<span class="minor"
                >(<!-- -->二<!-- -->)</span
              ></span
            ><span class="fake-btn pull-right"
              >檢視活動<!-- -->
              <i class="fa fa-angle-right"></i
            ></span></div
        ></a>
      </li>
      <li class="type-selling">
        <a href="https://changhuabus.kktix.cc/events/c267d5bb" class="cover"
          ><figure>
            <img
              alt=""
              src="https://assets.kktix.io/upload_images/291704/0740%E5%BD%B0_0_medium.jpg"
            />
            <figcaption>
              <span class="category"
                ><i class="fa fa-th-list"></i>
                <!-- -->戶外</span
              >
              <div class="info">
                <div class="info-inner">
                  <div class="info-content">
                    <div class="event-title">
                      <h2>【9路】02/10 (二) 07:40 彰化→溪頭</h2>
                    </div>
                    <div class="introduction">
                      <p>
                        注意事項：
                        請務必於發車前10分鐘至車站報到，逾時將由現場候位乘客替補，並請您改為現場候位。
                        超過3次未依規定時間報到者，將列為黑名單，不再提供預約服務。(已訂票之黑名單，將於發車前一日由系統自
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <ul class="groups clearfix"></ul>
            </figcaption>
          </figure>
          <div class="ft clearfix">
            <span class="date"
              ><i class="fa fa-calendar"></i>
              <!-- -->2026/2/10<span class="minor"
                >(<!-- -->二<!-- -->)</span
              ></span
            ><span class="fake-btn pull-right"
              >開賣中<!-- -->
              <i class="fa fa-angle-right"></i></span
            ><span class="fake-btn pull-right"
              >開賣中<!-- -->
              <i class="fa fa-angle-right"></i></span
            ><span class="fake-btn pull-right"
              >開賣中<!-- -->
              <i class="fa fa-angle-right"></i
            ></span></div
        ></a>
      </li>
    </ul>
  </div>
</div>
```

## 買票列表的分頁

```html
<div class="pagination pull-right">
  <ul>
    <li>
      <a
        href="/events?end_at=&amp;max_price=&amp;min_price=&amp;page=2&amp;search=%E6%BA%AA%E9%A0%AD&amp;start_at=2026%2F02%2F09"
        >‹</a
      >
    </li>

    <li class="">
      <a
        href="/events?end_at=&amp;max_price=&amp;min_price=&amp;search=%E6%BA%AA%E9%A0%AD&amp;start_at=2026%2F02%2F09"
        >1</a
      >
    </li>

    <li class="">
      <a
        rel="prev"
        href="/events?end_at=&amp;max_price=&amp;min_price=&amp;page=2&amp;search=%E6%BA%AA%E9%A0%AD&amp;start_at=2026%2F02%2F09"
        >2</a
      >
    </li>

    <li class="active">
      <a href="#">3</a>
    </li>

    <li class="">
      <a
        rel="next"
        href="/events?end_at=&amp;max_price=&amp;min_price=&amp;page=4&amp;search=%E6%BA%AA%E9%A0%AD&amp;start_at=2026%2F02%2F09"
        >4</a
      >
    </li>

    <li>
      <a
        href="/events?end_at=&amp;max_price=&amp;min_price=&amp;page=4&amp;search=%E6%BA%AA%E9%A0%AD&amp;start_at=2026%2F02%2F09"
        >›</a
      >
    </li>
  </ul>
</div>
```

## 買票卡片

```html
<li class="type-selling">
  <a href="https://changhuabus.kktix.cc/events/1a07b4dc" class="cover"
    ><figure>
      <img
        alt=""
        src="https://assets.kktix.io/upload_images/291975/%E6%BA%AA%E9%A0%AD%E5%93%A1%E6%9E%97%E4%B8%83%E9%BB%9E%E5%9B%9B%E5%8D%81_medium.jpg"
      />
      <figcaption>
        <span class="category"
          ><i class="fa fa-th-list"></i>
          <!-- -->戶外</span
        >
        <div class="info">
          <div class="info-inner">
            <div class="info-content">
              <div class="event-title">
                <h2>【10路】02/13 (五) 07:40 員林→溪頭</h2>
              </div>
              <div class="introduction">
                <p>
                  注意事項：
                  請務必於發車前10分鐘至車站報到，逾時將由現場候位乘客替補，並請您改為現場候位。
                  超過3次未依規定時間報到者，將列為黑名單，不再提供預約服務。(已訂票之黑名單，將於發車前一日由系統自
                </p>
              </div>
            </div>
          </div>
        </div>
        <ul class="groups clearfix"></ul>
      </figcaption>
    </figure>
    <div class="ft clearfix">
      <span class="date"
        ><i class="fa fa-calendar"></i>
        <!-- -->2026/2/13<span class="minor">(<!-- -->五<!-- -->)</span></span
      ><span class="fake-btn pull-right"
        >開賣中<!-- -->
        <i class="fa fa-angle-right"></i
      ></span></div
  ></a>
</li>
```

### 買票卡片的狀態信息

#### 開賣中

```html
<span class="fake-btn pull-right"
  >開賣中<!-- -->
  <i class="fa fa-angle-right"></i
></span>
```

#### 一小時後開賣

```html
<span class="fake-btn pull-right"
  >一小時後開賣<!-- -->
  <i class="fa fa-angle-right"></i
></span>
```

## 進入買票頁面（kktix的網頁應用稱"events"）

https://changhuabus.kktix.cc/events/1a07b4dc

## 用戶沒有登入或者登入己過期會導向「登入頁面」

如果用戶沒有登入或者登入己過期會導向「登入頁面」
https://kktix.com/events/1a07b4dc/registrations/new

## 點擊「登入」

我們己經有用戶，所以直接點擊「登入」

```html
<div class="modal-footer">
  <a
    ng-href="/users/sign_up?back_to=https://kktix.com/events/1a07b4dc/registrations/new"
    class="btn btn-primary pull-left ng-binding"
    href="/users/sign_up?back_to=https://kktix.com/events/1a07b4dc/registrations/new"
    >立即成為會員</a
  >
  <a
    ng-href="/users/sign_in?back_to=https://kktix.com/events/1a07b4dc/registrations/new"
    class="btn btn-primary pull-left ng-binding"
    href="/users/sign_in?back_to=https://kktix.com/events/1a07b4dc/registrations/new"
    >登入</a
  >
  <button
    type="button"
    class="btn btn-default pull-right ng-binding"
    data-dismiss="modal"
  >
    暫時不要
  </button>
</div>
```

## 點擊「登入」後，導向到「登入輸入頁面」

https://kktix.com/users/sign_in?back_to=https://kktix.com/events/1a07b4dc/registrations/new

## 「登入輸入頁面」 的輸入欄位

登入媽媽用戶
用戶：pc762827@gmail.com
密碼：0978762827@

用戶欄位

```html
<input
  data-email-suggestion="你要用的是 {{suggestion}} 嗎?"
  style="text-transform:lowercase;"
  class="string required"
  required="required"
  aria-required="true"
  placeholder="使用者名稱或 Email"
  type="text"
  name="user[login]"
  id="user_login"
/>
```

密碼欄位

```html
<div class="controls">
  <input
    class="password required"
    required="required"
    aria-required="true"
    placeholder="密碼"
    type="password"
    name="user[password]"
    id="user_password"
  />
</div>
```

提交按鈕

```html
<input
  type="submit"
  name="commit"
  value="登入"
  class="btn btn normal btn-login"
  data-disable-with="登入"
/>
```

## 登入後導向「驗證人類」頁面

需要勾選「驗證您是人類」

https://kktix.com/users/sign_in

勾選後導向買票頁面

https://kktix.com/events/1a07b4dc/registrations/new

如果有「座位」可以選

```html
<div class="display-table" id="ticket_1000393">
  <div class="display-table-row">
    <span class="ticket-name ng-binding">
      座位17
      <!-- ngIf: unitNotice -->
      <!-- ngIf: !!ticket.labelsText -->
      <div class="ticket-extra-info">
        <!-- ngIf: ticket.for_online_event -->
      </div>
    </span>
    <!-- ngIf: showSeatInfo() -->
    <span class="ticket-price">
      <!-- ngIf: ticket.price --><span ng-if="ticket.price" class="ng-scope">
        <!-- ngIf: ticket.price.cents > 0 -->
        <!-- ngIf: ticket.price.cents ==  0 --><span
          ng-if="ticket.price.cents ==  0"
          class="ng-binding ng-scope"
        >
          免費
          <span
            class="mobile-fee ng-binding"
            ng-bind-html="ticket.booking_fee_cents | feeAnnotation : ticket.price.currency"
          ></span> </span
        ><!-- end ngIf: ticket.price.cents ==  0 --> </span
      ><!-- end ngIf: ticket.price -->
    </span>
    <!-- ngIf: chargeBookingFee -->
    <!-- ngIf: purchasableAndSelectable --><span
      class="ticket-quantity ng-scope"
      ng-if="purchasableAndSelectable"
    >
      <button
        class="btn-default minus"
        ng-click="quantityBtnClick(-1)"
        ng-disabled="ticketModel.quantity &lt;= 0 || busy"
        disabled="disabled"
      >
        <i class="fa fa-minus"></i>
      </button>
      <input
        type="text"
        value="0"
        ng-keydown="quantityInputKeyDown($event)"
        ng-model="ticketModel.quantity"
        ng-keyup="quantityInputKeyUp($event)"
        ng-disabled="busy"
        class="ng-pristine ng-untouched ng-valid ng-not-empty"
      />
      <button
        class="btn-default plus"
        ng-click="quantityBtnClick(1)"
        ng-disabled="cantBuyMore()"
      >
        <i class="fa fa-plus"></i>
      </button> </span
    ><!-- end ngIf: purchasableAndSelectable -->
    <!-- ngIf: !purchasableAndSelectable -->
  </div>
  <!-- ngRepeat: addOn in ticket.add_ons -->
</div>
```

繼續選取，

```html
<button
  class="btn-default plus"
  ng-click="quantityBtnClick(1)"
  ng-disabled="cantBuyMore()"
>
  <i class="fa fa-plus"></i>
</button>
```

如果沒有「座位」

```html
<div class="display-table" id="ticket_1000398">
  <div class="display-table-row">
    <span class="ticket-name ng-binding">
      座位22
      <!-- ngIf: unitNotice -->
      <!-- ngIf: !!ticket.labelsText -->
      <div class="ticket-extra-info">
        <!-- ngIf: ticket.for_online_event -->
      </div>
    </span>
    <!-- ngIf: showSeatInfo() -->
    <span class="ticket-price">
      <!-- ngIf: ticket.price --><span ng-if="ticket.price" class="ng-scope">
        <!-- ngIf: ticket.price.cents > 0 -->
        <!-- ngIf: ticket.price.cents ==  0 --><span
          ng-if="ticket.price.cents ==  0"
          class="ng-binding ng-scope"
        >
          免費
          <span
            class="mobile-fee ng-binding"
            ng-bind-html="ticket.booking_fee_cents | feeAnnotation : ticket.price.currency"
          ></span> </span
        ><!-- end ngIf: ticket.price.cents ==  0 --> </span
      ><!-- end ngIf: ticket.price -->
    </span>
    <!-- ngIf: chargeBookingFee -->
    <!-- ngIf: purchasableAndSelectable -->
    <!-- ngIf: !purchasableAndSelectable --><span
      ng-if="!purchasableAndSelectable"
      class="ticket-quantity ng-binding ng-scope"
    >
      已售完
      <!-- ngIf: reasonDesc --> </span
    ><!-- end ngIf: !purchasableAndSelectable -->
  </div>
  <!-- ngRepeat: addOn in ticket.add_ons -->
</div>
```

繼續勾選「我已經閱讀並同意」

```html
<label for="person_agree_terms" class="checkbox-inline ng-binding">
  <input
    id="person_agree_terms"
    type="checkbox"
    value="agree"
    ng-model="conditions.agreeTerm"
    class="ng-valid ng-dirty ng-valid-parse ng-not-empty ng-touched"
  />
  我已經閱讀並同意
  <a
    ng-href="https://kktix.com/terms"
    target="_blank"
    class="ng-binding"
    href="https://kktix.com/terms"
  >
    服務條款
  </a>
  與
  <a
    ng-href="https://kktix.com/policy"
    target="_blank"
    class="ng-binding"
    href="https://kktix.com/policy"
  >
    隱私權政策
  </a>
  <!-- ngIf: policy -->
  <!-- ngIf: showAgreeReceipt() -->
</label>
```

按下一步時，繼續做「圖片驗證」

```html
<div id="rc-imageselect" aria-modal="true" role="dialog">
  <div class="rc-imageselect-response-field"></div>
  <span class="rc-imageselect-tabloop-begin" tabindex="0"></span>
  <div class="rc-imageselect-payload">
    <div class="rc-imageselect-instructions">
      <div class="rc-imageselect-desc-wrapper">
        <div
          class="rc-imageselect-desc-no-canonical"
          style="width: 352px; font-size: 12px; margin-top: -3px;"
        >
          選取圖片中含有<strong style="font-size: 28px;">高山或山丘</strong
          >的所有圖片。
        </div>
      </div>
      <div class="rc-imageselect-progress"></div>
    </div>
    <div class="rc-imageselect-challenge">
      <div
        id="rc-imageselect-target"
        class="rc-imageselect-target"
        dir="ltr"
        role="presentation"
        aria-hidden="true"
      >
        <table class="rc-imageselect-table-33">
          <tbody>
            <tr>
              <td
                role="button"
                id="0"
                tabindex="0"
                class="rc-imageselect-tile"
                aria-label="圖片驗證測試"
              >
                <div class="rc-image-tile-target">
                  <div
                    class="rc-image-tile-wrapper"
                    style="width: 126px; height: 126px"
                  >
                    <img
                      class="rc-image-tile-33"
                      src="https://www.recaptcha.net/recaptcha/api2/payload?p=06AFcWeA6nXbaprcqlgZH5pclCzSGrzLS3nFO517daZd7THQYZnkxDSqndFNHmW1WpnTHFKaXMrQozHgzmRaOV2ImGFauSbFLi3tKFbl-sFARRLpWI3JExsVB8v3SMWMNsTvDB5Y1reYRCPu8YllfATt97Fv2du-VouaAfdKF2d0ETxCtcpiG6_lUfYCHGhADhQUgPUy_jcHZIc3evN95V9AnzazKgFg0UgdKm7KsxIj9Pc2aKgjrNka8&amp;k=6LfAmDsmAAAAANOYx4ajYcIuWB7jZiO4NpKoWiA2"
                      alt=""
                      style="top:0%; left: 0%"
                    />
                    <div class="rc-image-tile-overlay"></div>
                  </div>
                  <div class="rc-imageselect-checkbox"></div>
                </div>
              </td>
              <td
                role="button"
                id="1"
                tabindex="0"
                class="rc-imageselect-tile"
                aria-label="圖片驗證測試"
              >
                <div class="rc-image-tile-target">
                  <div
                    class="rc-image-tile-wrapper"
                    style="width: 126px; height: 126px"
                  >
                    <img
                      class="rc-image-tile-33"
                      src="https://www.recaptcha.net/recaptcha/api2/payload?p=06AFcWeA6nXbaprcqlgZH5pclCzSGrzLS3nFO517daZd7THQYZnkxDSqndFNHmW1WpnTHFKaXMrQozHgzmRaOV2ImGFauSbFLi3tKFbl-sFARRLpWI3JExsVB8v3SMWMNsTvDB5Y1reYRCPu8YllfATt97Fv2du-VouaAfdKF2d0ETxCtcpiG6_lUfYCHGhADhQUgPUy_jcHZIc3evN95V9AnzazKgFg0UgdKm7KsxIj9Pc2aKgjrNka8&amp;k=6LfAmDsmAAAAANOYx4ajYcIuWB7jZiO4NpKoWiA2"
                      alt=""
                      style="top:0%; left: -100%"
                    />
                    <div class="rc-image-tile-overlay"></div>
                  </div>
                  <div class="rc-imageselect-checkbox"></div>
                </div>
              </td>
              <td
                role="button"
                id="2"
                tabindex="0"
                class="rc-imageselect-tile"
                aria-label="圖片驗證測試"
              >
                <div class="rc-image-tile-target">
                  <div
                    class="rc-image-tile-wrapper"
                    style="width: 126px; height: 126px"
                  >
                    <img
                      class="rc-image-tile-33"
                      src="https://www.recaptcha.net/recaptcha/api2/payload?p=06AFcWeA6nXbaprcqlgZH5pclCzSGrzLS3nFO517daZd7THQYZnkxDSqndFNHmW1WpnTHFKaXMrQozHgzmRaOV2ImGFauSbFLi3tKFbl-sFARRLpWI3JExsVB8v3SMWMNsTvDB5Y1reYRCPu8YllfATt97Fv2du-VouaAfdKF2d0ETxCtcpiG6_lUfYCHGhADhQUgPUy_jcHZIc3evN95V9AnzazKgFg0UgdKm7KsxIj9Pc2aKgjrNka8&amp;k=6LfAmDsmAAAAANOYx4ajYcIuWB7jZiO4NpKoWiA2"
                      alt=""
                      style="top:0%; left: -200%"
                    />
                    <div class="rc-image-tile-overlay"></div>
                  </div>
                  <div class="rc-imageselect-checkbox"></div>
                </div>
              </td>
            </tr>
            <tr>
              <td
                role="button"
                id="3"
                tabindex="0"
                class="rc-imageselect-tile"
                aria-label="圖片驗證測試"
              >
                <div class="rc-image-tile-target">
                  <div
                    class="rc-image-tile-wrapper"
                    style="width: 126px; height: 126px"
                  >
                    <img
                      class="rc-image-tile-33"
                      src="https://www.recaptcha.net/recaptcha/api2/payload?p=06AFcWeA6nXbaprcqlgZH5pclCzSGrzLS3nFO517daZd7THQYZnkxDSqndFNHmW1WpnTHFKaXMrQozHgzmRaOV2ImGFauSbFLi3tKFbl-sFARRLpWI3JExsVB8v3SMWMNsTvDB5Y1reYRCPu8YllfATt97Fv2du-VouaAfdKF2d0ETxCtcpiG6_lUfYCHGhADhQUgPUy_jcHZIc3evN95V9AnzazKgFg0UgdKm7KsxIj9Pc2aKgjrNka8&amp;k=6LfAmDsmAAAAANOYx4ajYcIuWB7jZiO4NpKoWiA2"
                      alt=""
                      style="top:-100%; left: 0%"
                    />
                    <div class="rc-image-tile-overlay"></div>
                  </div>
                  <div class="rc-imageselect-checkbox"></div>
                </div>
              </td>
              <td
                role="button"
                id="4"
                tabindex="0"
                class="rc-imageselect-tile"
                aria-label="圖片驗證測試"
              >
                <div class="rc-image-tile-target">
                  <div
                    class="rc-image-tile-wrapper"
                    style="width: 126px; height: 126px"
                  >
                    <img
                      class="rc-image-tile-33"
                      src="https://www.recaptcha.net/recaptcha/api2/payload?p=06AFcWeA6nXbaprcqlgZH5pclCzSGrzLS3nFO517daZd7THQYZnkxDSqndFNHmW1WpnTHFKaXMrQozHgzmRaOV2ImGFauSbFLi3tKFbl-sFARRLpWI3JExsVB8v3SMWMNsTvDB5Y1reYRCPu8YllfATt97Fv2du-VouaAfdKF2d0ETxCtcpiG6_lUfYCHGhADhQUgPUy_jcHZIc3evN95V9AnzazKgFg0UgdKm7KsxIj9Pc2aKgjrNka8&amp;k=6LfAmDsmAAAAANOYx4ajYcIuWB7jZiO4NpKoWiA2"
                      alt=""
                      style="top:-100%; left: -100%"
                    />
                    <div class="rc-image-tile-overlay"></div>
                  </div>
                  <div class="rc-imageselect-checkbox"></div>
                </div>
              </td>
              <td
                role="button"
                id="5"
                tabindex="0"
                class="rc-imageselect-tile"
                aria-label="圖片驗證測試"
              >
                <div class="rc-image-tile-target">
                  <div
                    class="rc-image-tile-wrapper"
                    style="width: 126px; height: 126px"
                  >
                    <img
                      class="rc-image-tile-33"
                      src="https://www.recaptcha.net/recaptcha/api2/payload?p=06AFcWeA6nXbaprcqlgZH5pclCzSGrzLS3nFO517daZd7THQYZnkxDSqndFNHmW1WpnTHFKaXMrQozHgzmRaOV2ImGFauSbFLi3tKFbl-sFARRLpWI3JExsVB8v3SMWMNsTvDB5Y1reYRCPu8YllfATt97Fv2du-VouaAfdKF2d0ETxCtcpiG6_lUfYCHGhADhQUgPUy_jcHZIc3evN95V9AnzazKgFg0UgdKm7KsxIj9Pc2aKgjrNka8&amp;k=6LfAmDsmAAAAANOYx4ajYcIuWB7jZiO4NpKoWiA2"
                      alt=""
                      style="top:-100%; left: -200%"
                    />
                    <div class="rc-image-tile-overlay"></div>
                  </div>
                  <div class="rc-imageselect-checkbox"></div>
                </div>
              </td>
            </tr>
            <tr>
              <td
                role="button"
                id="6"
                tabindex="0"
                class="rc-imageselect-tile"
                aria-label="圖片驗證測試"
              >
                <div class="rc-image-tile-target">
                  <div
                    class="rc-image-tile-wrapper"
                    style="width: 126px; height: 126px"
                  >
                    <img
                      class="rc-image-tile-33"
                      src="https://www.recaptcha.net/recaptcha/api2/payload?p=06AFcWeA6nXbaprcqlgZH5pclCzSGrzLS3nFO517daZd7THQYZnkxDSqndFNHmW1WpnTHFKaXMrQozHgzmRaOV2ImGFauSbFLi3tKFbl-sFARRLpWI3JExsVB8v3SMWMNsTvDB5Y1reYRCPu8YllfATt97Fv2du-VouaAfdKF2d0ETxCtcpiG6_lUfYCHGhADhQUgPUy_jcHZIc3evN95V9AnzazKgFg0UgdKm7KsxIj9Pc2aKgjrNka8&amp;k=6LfAmDsmAAAAANOYx4ajYcIuWB7jZiO4NpKoWiA2"
                      alt=""
                      style="top:-200%; left: 0%"
                    />
                    <div class="rc-image-tile-overlay"></div>
                  </div>
                  <div class="rc-imageselect-checkbox"></div>
                </div>
              </td>
              <td
                role="button"
                id="7"
                tabindex="0"
                class="rc-imageselect-tile"
                aria-label="圖片驗證測試"
              >
                <div class="rc-image-tile-target">
                  <div
                    class="rc-image-tile-wrapper"
                    style="width: 126px; height: 126px"
                  >
                    <img
                      class="rc-image-tile-33"
                      src="https://www.recaptcha.net/recaptcha/api2/payload?p=06AFcWeA6nXbaprcqlgZH5pclCzSGrzLS3nFO517daZd7THQYZnkxDSqndFNHmW1WpnTHFKaXMrQozHgzmRaOV2ImGFauSbFLi3tKFbl-sFARRLpWI3JExsVB8v3SMWMNsTvDB5Y1reYRCPu8YllfATt97Fv2du-VouaAfdKF2d0ETxCtcpiG6_lUfYCHGhADhQUgPUy_jcHZIc3evN95V9AnzazKgFg0UgdKm7KsxIj9Pc2aKgjrNka8&amp;k=6LfAmDsmAAAAANOYx4ajYcIuWB7jZiO4NpKoWiA2"
                      alt=""
                      style="top:-200%; left: -100%"
                    />
                    <div class="rc-image-tile-overlay"></div>
                  </div>
                  <div class="rc-imageselect-checkbox"></div>
                </div>
              </td>
              <td
                role="button"
                id="8"
                tabindex="0"
                class="rc-imageselect-tile"
                aria-label="圖片驗證測試"
              >
                <div class="rc-image-tile-target">
                  <div
                    class="rc-image-tile-wrapper"
                    style="width: 126px; height: 126px"
                  >
                    <img
                      class="rc-image-tile-33"
                      src="https://www.recaptcha.net/recaptcha/api2/payload?p=06AFcWeA6nXbaprcqlgZH5pclCzSGrzLS3nFO517daZd7THQYZnkxDSqndFNHmW1WpnTHFKaXMrQozHgzmRaOV2ImGFauSbFLi3tKFbl-sFARRLpWI3JExsVB8v3SMWMNsTvDB5Y1reYRCPu8YllfATt97Fv2du-VouaAfdKF2d0ETxCtcpiG6_lUfYCHGhADhQUgPUy_jcHZIc3evN95V9AnzazKgFg0UgdKm7KsxIj9Pc2aKgjrNka8&amp;k=6LfAmDsmAAAAANOYx4ajYcIuWB7jZiO4NpKoWiA2"
                      alt=""
                      style="top:-200%; left: -200%"
                    />
                    <div class="rc-image-tile-overlay"></div>
                  </div>
                  <div class="rc-imageselect-checkbox"></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="rc-imageselect-incorrect-response" style="display:none">
      請再試一次。
    </div>
    <div aria-live="polite">
      <div class="rc-imageselect-error-select-more" style="display:none">
        請選取所有相符的圖片。
      </div>
      <div class="rc-imageselect-error-dynamic-more" style="display:none">
        也請查看新的圖片。
      </div>
      <div class="rc-imageselect-error-select-something" style="display:none">
        請框選物件；如果沒有物件，則請重新載入。
      </div>
    </div>
  </div>
  <div class="rc-footer">
    <div class="rc-separator"></div>
    <div class="rc-controls">
      <div class="primary-controls">
        <div class="rc-buttons">
          <div class="button-holder reload-button-holder">
            <button
              class="rc-button goog-inline-block rc-button-reload"
              title="換一個驗證測試"
              value=""
              id="recaptcha-reload-button"
              tabindex="0"
            ></button>
          </div>
          <div class="button-holder audio-button-holder">
            <button
              class="rc-button goog-inline-block rc-button-audio"
              title="改答語音版本驗證測試"
              value=""
              id="recaptcha-audio-button"
              tabindex="0"
            ></button>
          </div>
          <div class="button-holder image-button-holder">
            <button
              class="rc-button goog-inline-block rc-button-image"
              title="改答圖片驗證測試"
              value=""
              id="recaptcha-image-button"
              tabindex="0"
              style="display: none;"
            ></button>
          </div>
          <div
            class="button-holder liveness-button-holder"
            style="display: none;"
          ></div>
          <div
            class="button-holder qr-button-holder"
            style="display: none;"
          ></div>
          <div class="button-holder help-button-holder">
            <button
              class="rc-button goog-inline-block rc-button-help"
              title="說明"
              value=""
              id="recaptcha-help-button"
              tabindex="0"
            ></button>
          </div>
          <div class="button-holder undo-button-holder">
            <button
              class="rc-button goog-inline-block rc-button-undo"
              title="復原"
              value=""
              id="recaptcha-undo-button"
              tabindex="0"
              style="display: none;"
            ></button>
          </div>
        </div>
        <div class="verify-button-holder">
          <button
            class="rc-button-default goog-inline-block"
            title=""
            value=""
            id="recaptcha-verify-button"
            tabindex="0"
          >
            驗證
          </button>
        </div>
      </div>
      <div class="rc-challenge-help" style="display:none" tabindex="0"></div>
    </div>
  </div>
  <span class="rc-imageselect-tabloop-end" tabindex="0"></span>
</div>
```

驗證完「圖片驗證」導向，訂購成功頁面

https://kktix.com/events/1a07b4dc/registrations/152765235-768f90c5e8a145ff6bf436f303f3214d#/

要勾選「在公開頁面顯示您參加了本活動」

```html
<label class="checkbox-inline ng-binding">
  <input
    type="checkbox"
    ng-model="values.displayInfo"
    class="ng-pristine ng-untouched ng-valid ng-not-empty"
  />
  在公開頁面顯示您參加了本活動
  <i
    class="fa fa-info-circle fa-last"
    rel="tooltip"
    title="勾選後，可以讓別人從活動頁或您的個人頁面上得知您參加了這個活動。"
  ></i>
</label>
```

點擊頁面「確認表單資料」才是買票訂購完成。

```html
<a
  class="btn btn-primary btn-lg ng-binding ng-isolate-scope"
  kk-busy-spinner="submitting"
  ng-disabled="submitting"
  ng-click="confirmOrder()"
  >確認表單資料</a
>
```
