$(function () {

    function storeQuery(query) {

        localStorage.setItem("lastQuery", query);
        let history = $("<div>");
        history.append(localStorage.getItem("lastQuery"));
        $("#history").append(history);
        history.addClass("redosearch");

        $(".redosearch").click(function () {
            //let baseUrl = "https://openlibrary.org/search.json";
            let query = $(this).text();
            $("#searchtext").val(query);
            let data = JSON.parse(localStorage.getItem(query));
            let i = 0;
            let newRow;
            data.docs.forEach(function (book) {
                if (i % 4 === 0) {
                    newRow = $("<div id='row" + i + "'></div>");
                    newRow.addClass("row");
                    $("#searchresults").prepend(newRow);
                }

                i++;
                newRow.append(createSearchDiv(book));
            });

            $(".book").click(function () {
                $(this).toggleClass("clicked");
            });
        });
    }

    $("form").submit(function (e) {
        e.preventDefault();

        let query = $("#searchtext").val();
        let baseUrl = "https://openlibrary.org/search.json";
        storeQuery(query);

        $.getJSON(baseUrl, { q: query })
            .done(function (data) {
                console.log(data);
                localStorage.setItem(query, JSON.stringify(data));
                let i = 0;
                let newRow;
                data.docs.forEach(function (book) {
                    if (i % 4 === 0) {
                        newRow = $("<div id='row" + i + "'></div>");
                        newRow.addClass("row");
                        $("#searchresults").prepend(newRow);
                    }

                    i++;
                    newRow.append(createSearchDiv(book));
                });

                $(".book").click(function () {
                    $(this).toggleClass("clicked");
                });
            });


    });


    function createSearchDiv(data) {
        let outerDiv = $("<div>");
        let firstSenetence = $("<div>");
        let nameElement = $("<div>");
        let titleElement = $("<div>");
        let canvasElement = $('<canvas id="theCanvas" width="200" height="100" style="border: 1px solid grey">');

        if (data.isbn) {


            let isbn = data.isbn[0];
            let ctx = canvasElement[0].getContext("2d");

            let baseUrl = "http://covers.openlibrary.org/b/isbn/";

            let cover = new Image();
            cover.src = baseUrl + isbn + "-S.jpg";
            cover.onload = function () {
                ctx.drawImage(cover, 71, 21);
                ctx.font = "30px Arial";
                ctx.fillText(isbn, 10, 50);

            }



        }

        if (data.author_name != undefined) {
            data.author_name.forEach(function (name) {

                nameElement.text(nameElement.text() + name + " ");


            });
        }
        firstSenetence.text(data.first_sentence);

        titleElement.text(data.title);
        outerDiv.append(nameElement);
        outerDiv.append(titleElement);
        outerDiv.append(firstSenetence);
        outerDiv.append(canvasElement);

        outerDiv.addClass('col');
        outerDiv.addClass("book");

        return outerDiv;
    }
});
