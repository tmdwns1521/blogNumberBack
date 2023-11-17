import axios from 'axios';

import {mysqlWriteServer, mysqlReadServer} from '../config/database.js';

const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Seoul' };
async function sleep(seconds) {
  return new Promise(resolve => {
    setTimeout(resolve, seconds * 1000); // setTimeout은 밀리초 단위로 대기합니다.
  });
}
export async function placeRankData() {
    const placeRankQuery = 'SELECT * FROM placeRankManagement';
    const rs = await mysqlReadServer.query(placeRankQuery);
    return rs[0]
}

export async function delay(seconds) {
  return new Promise(resolve => {
    setTimeout(resolve, seconds * 1000);
  });
}

export async function placeReview(placeNumber) {
    try {
        const placeUrl = `https://m.place.naver.com/restaurant/${placeNumber}/review/visitor?entry=pll`;
        const headers = {
            'Cookie': 'NNB=ZFPCSNKNEEAGK',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
        }
        const rs = await axios.get(placeUrl, { headers });
        const reviewCount = rs.data.split('"fsasReviews":')[1].split('"maxItemCount"')[0].split('"total":')[1].split(',')[0];
        const visitorReviewsTotal = rs.data.split('"visitorReviewsTotal":')[1].split(',')[0];
        return {reviewCount: reviewCount, visitorReviewsTotal: visitorReviewsTotal}
    } catch (error) {
        console.error(error);
    }
}

export async function restaurantCrawler(page, placeNumber, keyword, headers) {
    try {
        console.log(page);
        const placeUrl = 'https://api.place.naver.com/graphql';
        const payload = [
            {
                "operationName":
                    "getRestaurantList",
                "variables":
                    {
                        "restaurantListInput":
                            {
                                "query":keyword,
                                "x":"126.9783882",
                                "y":"37.5666103",
                                "start":page,
                                "display":100,
                                "takeout":null,
                                "orderBenefit":null,
                                "filterOpening":null,
                                "isNmap":false,
                                "deviceType":"pc"
                            },
                        "isNmap":false,
                        "isBounds":false
                    },
                "query":"query getRestaurantList($restaurantListInput: RestaurantListInput, $restaurantListFilterInput: RestaurantListFilterInput, $isNmap: Boolean!, $isBounds: Boolean!) {\n  restaurants: restaurantList(input: $restaurantListInput) {\n    items {\n      id\n      apolloCacheId\n      dbType\n      name\n      businessCategory\n      category\n      description\n      hasBooking\n      hasNPay\n      x\n      y\n      distance\n      imageUrl\n      imageUrls\n      imageCount\n      phone\n      virtualPhone\n      routeUrl\n      streetPanorama {\n        id\n        pan\n        tilt\n        lat\n        lon\n        __typename\n      }\n      roadAddress\n      address\n      commonAddress\n      blogCafeReviewCount\n      bookingReviewCount\n      totalReviewCount\n      bookingReviewScore\n      bookingUrl\n      bookingHubUrl\n      bookingHubButtonName\n      bookingBusinessId\n      talktalkUrl\n      options\n      promotionTitle\n      agencyId\n      businessHours\n      visitorImages {\n        id\n        reviewId\n        imageUrl\n        profileImageUrl\n        nickname\n        __typename\n      }\n      visitorReviews {\n        id\n        review\n        reviewId\n        __typename\n      }\n      foryouLabel\n      foryouTasteType\n      microReview\n      tags\n      priceCategory\n      broadcastInfo {\n        program\n        date\n        menu\n        __typename\n      }\n      michelinGuide {\n        year\n        star\n        comment\n        url\n        hasGrade\n        isBib\n        alternateText\n        hasExtraNew\n        __typename\n      }\n      broadcasts {\n        program\n        menu\n        episode\n        broadcast_date\n        __typename\n      }\n      tvcastId\n      naverBookingCategory\n      saveCount\n      uniqueBroadcasts\n      isDelivery\n      isCvsDelivery\n      markerId @include(if: $isNmap)\n      markerLabel @include(if: $isNmap) {\n        text\n        style\n        __typename\n      }\n      imageMarker @include(if: $isNmap) {\n        marker\n        markerSelected\n        __typename\n      }\n      isTableOrder\n      isPreOrder\n      isTakeOut\n      bookingDisplayName\n      bookingVisitId\n      bookingPickupId\n      popularMenuImages {\n        name\n        price\n        bookingCount\n        menuUrl\n        menuListUrl\n        imageUrl\n        isPopular\n        usePanoramaImage\n        __typename\n      }\n      visitorReviewCount\n      visitorReviewScore\n      detailCid {\n        c0\n        c1\n        c2\n        c3\n        __typename\n      }\n      streetPanorama {\n        id\n        pan\n        tilt\n        lat\n        lon\n        __typename\n      }\n      newOpening\n      easyOrder {\n        easyOrderId\n        easyOrderCid\n        businessHours {\n          weekday {\n            start\n            end\n            __typename\n          }\n          weekend {\n            start\n            end\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      baemin {\n        businessHours {\n          deliveryTime {\n            start\n            end\n            __typename\n          }\n          closeDate {\n            start\n            end\n            __typename\n          }\n          temporaryCloseDate {\n            start\n            end\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      yogiyo {\n        businessHours {\n          actualDeliveryTime {\n            start\n            end\n            __typename\n          }\n          bizHours {\n            start\n            end\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      newBusinessHours {\n        status\n        description\n        __typename\n      }\n      coupon {\n        total\n        promotions {\n          promotionSeq\n          couponSeq\n          conditionType\n          image {\n            url\n            __typename\n          }\n          title\n          description\n          type\n          couponUseType\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    restaurantCategory\n    queryString\n    siteSort\n    selectedFilter {\n      order\n      rank\n      tvProgram\n      region\n      brand\n      menu\n      food\n      mood\n      purpose\n      sortingOrder\n      takeout\n      orderBenefit\n      cafeFood\n      day\n      time\n      age\n      gender\n      myPreference\n      hasMyPreference\n      cafeMenu\n      cafeTheme\n      theme\n      voting\n      filterOpening\n      keywordFilter\n      property\n      __typename\n    }\n    rcodes\n    location {\n      sasX\n      sasY\n      __typename\n    }\n    nlu {\n      ...NluFields\n      __typename\n    }\n    optionsForMap @include(if: $isBounds) {\n      ...OptionsForMap\n      __typename\n    }\n    searchGuide @include(if: $isNmap) {\n      queryResults {\n        regions {\n          displayTitle\n          query\n          region {\n            rcode\n            __typename\n          }\n          __typename\n        }\n        isBusinessName\n        __typename\n      }\n      queryIndex\n      types\n      __typename\n    }\n    total\n    __typename\n  }\n  filters: restaurantListFilter(input: $restaurantListFilterInput) {\n    filters {\n      index\n      name\n      value\n      multiSelectable\n      defaultParams {\n        age\n        gender\n        day\n        time\n        __typename\n      }\n      items {\n        index\n        name\n        value\n        selected\n        representative\n        clickCode\n        laimCode\n        type\n        icon\n        __typename\n      }\n      __typename\n    }\n    votingKeywordList {\n      items {\n        name\n        value\n        icon\n        clickCode\n        __typename\n      }\n      total\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment NluFields on Nlu {\n  queryType\n  user {\n    gender\n    __typename\n  }\n  queryResult {\n    ptn0\n    ptn1\n    region\n    spot\n    tradeName\n    service\n    selectedRegion {\n      name\n      index\n      x\n      y\n      __typename\n    }\n    selectedRegionIndex\n    otherRegions {\n      name\n      index\n      __typename\n    }\n    property\n    keyword\n    queryType\n    nluQuery\n    businessType\n    cid\n    branch\n    forYou\n    franchise\n    titleKeyword\n    location {\n      x\n      y\n      default\n      longitude\n      latitude\n      dong\n      si\n      __typename\n    }\n    noRegionQuery\n    priority\n    showLocationBarFlag\n    themeId\n    filterBooking\n    repRegion\n    repSpot\n    dbQuery {\n      isDefault\n      name\n      type\n      getType\n      useFilter\n      hasComponents\n      __typename\n    }\n    type\n    category\n    menu\n    context\n    __typename\n  }\n  __typename\n}\n\nfragment OptionsForMap on OptionsForMap {\n  maxZoom\n  minZoom\n  includeMyLocation\n  maxIncludePoiCount\n  center\n  spotId\n  keepMapBounds\n  __typename\n}\n"
            }
            ];
        const rs = await axios.post(placeUrl, payload, { headers });
        const items = rs?.data[0]?.data?.restaurants?.items;
        if (items.length === 0) return -1;
        const findIndex = items.findIndex((item) => item.id === placeNumber);
        if (findIndex <= 0) {
            page += 100;
            await sleep(2);
            return restaurantCrawler(page, placeNumber, keyword, headers);
        }
        return page + findIndex;
    } catch (error) {
        console.error(error);
    }
}

export async function placeCrawler(page, placeNumber, keyword, headers) {
    try {
        const placeUrl = 'https://api.place.naver.com/graphql';
        const payload = [
            {
                "operationName":
                    "getPlacesList",
                "variables":
                    {
                        "useReverseGeocode": false,
                        "input":
                            {
                                "query":keyword,
                                "start":page,
                                "display":100,
                                "adult":false,
                                "spq":false,
                                "queryRank":"",
                                "x":"126.9783882",
                                "y":"37.5666103",
                                "deviceType":"pc",
                                "sessionId":"bJZJDk101v0dL++ooB2DIg=="
                            },
                        "isNmap":false,
                        "isBounds":false
                    },
                "query":"query getPlacesList($input: PlacesInput, $isNmap: Boolean!, $isBounds: Boolean!, $reverseGeocodingInput: ReverseGeocodingInput, $useReverseGeocode: Boolean = false) {\n  businesses: places(input: $input) {\n    total\n    items {\n      id\n      name\n      normalizedName\n      category\n      detailCid {\n        c0\n        c1\n        c2\n        c3\n        __typename\n      }\n      categoryCodeList\n      dbType\n      distance\n      roadAddress\n      address\n      fullAddress\n      commonAddress\n      bookingUrl\n      phone\n      virtualPhone\n      businessHours\n      daysOff\n      imageUrl\n      imageCount\n      x\n      y\n      poiInfo {\n        polyline {\n          shapeKey {\n            id\n            name\n            version\n            __typename\n          }\n          boundary {\n            minX\n            minY\n            maxX\n            maxY\n            __typename\n          }\n          details {\n            totalDistance\n            arrivalAddress\n            departureAddress\n            __typename\n          }\n          __typename\n        }\n        polygon {\n          shapeKey {\n            id\n            name\n            version\n            __typename\n          }\n          boundary {\n            minX\n            minY\n            maxX\n            maxY\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      subwayId\n      markerId @include(if: $isNmap)\n      markerLabel @include(if: $isNmap) {\n        text\n        style\n        stylePreset\n        __typename\n      }\n      imageMarker @include(if: $isNmap) {\n        marker\n        markerSelected\n        __typename\n      }\n      oilPrice @include(if: $isNmap) {\n        gasoline\n        diesel\n        lpg\n        __typename\n      }\n      isPublicGas\n      isDelivery\n      isTableOrder\n      isPreOrder\n      isTakeOut\n      isCvsDelivery\n      hasBooking\n      naverBookingCategory\n      bookingDisplayName\n      bookingBusinessId\n      bookingVisitId\n      bookingPickupId\n      easyOrder {\n        easyOrderId\n        easyOrderCid\n        businessHours {\n          weekday {\n            start\n            end\n            __typename\n          }\n          weekend {\n            start\n            end\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      baemin {\n        businessHours {\n          deliveryTime {\n            start\n            end\n            __typename\n          }\n          closeDate {\n            start\n            end\n            __typename\n          }\n          temporaryCloseDate {\n            start\n            end\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      yogiyo {\n        businessHours {\n          actualDeliveryTime {\n            start\n            end\n            __typename\n          }\n          bizHours {\n            start\n            end\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      isPollingStation\n      hasNPay\n      talktalkUrl\n      visitorReviewCount\n      visitorReviewScore\n      blogCafeReviewCount\n      bookingReviewCount\n      streetPanorama {\n        id\n        pan\n        tilt\n        lat\n        lon\n        __typename\n      }\n      naverBookingHubId\n      bookingHubUrl\n      bookingHubButtonName\n      newOpening\n      newBusinessHours {\n        status\n        description\n        dayOff\n        dayOffDescription\n        __typename\n      }\n      coupon {\n        total\n        promotions {\n          promotionSeq\n          couponSeq\n          conditionType\n          image {\n            url\n            __typename\n          }\n          title\n          description\n          type\n          couponUseType\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    optionsForMap @include(if: $isBounds) {\n      ...OptionsForMap\n      displayCorrectAnswer\n      correctAnswerPlaceId\n      __typename\n    }\n    searchGuide {\n      queryResults {\n        regions {\n          displayTitle\n          query\n          region {\n            rcode\n            __typename\n          }\n          __typename\n        }\n        isBusinessName\n        __typename\n      }\n      queryIndex\n      types\n      __typename\n    }\n    queryString\n    siteSort\n    __typename\n  }\n  reverseGeocodingAddr(input: $reverseGeocodingInput) @include(if: $useReverseGeocode) {\n    ...ReverseGeocodingAddr\n    __typename\n  }\n}\n\nfragment OptionsForMap on OptionsForMap {\n  maxZoom\n  minZoom\n  includeMyLocation\n  maxIncludePoiCount\n  center\n  spotId\n  keepMapBounds\n  __typename\n}\n\nfragment ReverseGeocodingAddr on ReverseGeocodingResult {\n  rcode\n  region\n  __typename\n}\n"
            }];
        const rs = await axios.post(placeUrl, payload, { headers });
        const items = rs?.data[0]?.data?.businesses?.items;
        if (items.length === 0) return -1;
        const findIndex = items.findIndex((item) => item.id === placeNumber);
        if (findIndex < 0) {
            page += 100;
            await sleep(2);
            return placeCrawler(page, placeNumber, keyword, headers);
        }
        return page + findIndex;
    } catch (error) {
        console.error(error);
    }
}

export async function placeRankCrawler(data) {
    const headers = {
            'Cookie': 'NNB=ZFPCSNKNEEAGK',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
        }
    try {
        for (const item of data) {
            const keyword = item.keyword;
            const placeNumber = item.placeNumber;
            let page = 1;
            let rank;
            if (item.type === 0) {
                console.log('type 1');
                rank = await restaurantCrawler(page, placeNumber, keyword, headers);
            } else if (item.type === 1) {
                console.log('type 2');
                rank = await placeCrawler(page, placeNumber, keyword, headers);
            }
            await sleep(1);
            const reviewData = await placeReview(placeNumber);
            await sleep(2);
            await mysqlWriteServer.query('UPDATE placeRankManagement SET `rank` = ?, visitCount = ?, ReviewCount = ?, update_at = ? WHERE id = ?', [rank, reviewData.visitorReviewsTotal !== 'null' ? reviewData.visitorReviewsTotal : 0, reviewData.reviewCount !== 'null' ? reviewData.reviewCount : 0, new Date(), item.id]);
        }
        return true;
    } catch (e) {
        console.log(e);
    }
}
export async function OnPlaceRank() {
    const data = await placeRankData()
    await placeRankCrawler(data);
}