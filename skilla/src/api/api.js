export const api = {
  getData(dateStart, dateEnd, pageSize, currentPage, inOut) {
    let url = "";
    if (dateStart && dateEnd) {
      url = `date_start=${dateStart.toLocaleDateString(
        "fr-CA"
      )}&date_end=${dateEnd.toLocaleDateString("fr-CA")}`;
    }
    if (inOut) {
      url += `&in_out=${inOut}`;
    }
    if (pageSize) {
      url += `&limit=${pageSize}`;
    }
    if (currentPage) {
      url += `&offset=${currentPage}`;
    }
    if (url) {
      url = "?" + url;
    }

    return fetch("https://api.skilla.ru/mango/getList" + url, {
      method: "POST",
      headers: {
        Authorization: "Bearer testtoken",
      },
    })
      .then((response) => {
        return response.json();
      })

      .catch((err) => {
        console.log("hi");
        console.log(err.response);
      });
  },

  getRecord(record, partnership) {
    return fetch(
      "https://api.skilla.ru/mango/getRecord?record=" +
        record +
        "&partnership_id=" +
        partnership,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer testtoken",
        },
      }
    )
      .then((response) => {
        return response;
      })

      .catch((err) => {
        console.log("error");
        console.log(err.response);
      });
  },
};
