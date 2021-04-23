from flask import Flask, render_template, redirect, Response, send_from_directory

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/marker-cluster")
def marker_cluster():
    return render_template("marker-cluster.html")

@app.route("/choropleth-time")
def choropleth_time():
    return render_template("choropleth-time.html")

@app.route("/source-data")
def source_data():
    return render_template("data.html")

@app.route("/data")
def get_csv():
    with open("./static/data/new_data.csv") as f:
        csv = f.read()

    return Response(csv, mimetype="text/csv")

@app.route("/marker")
def send_js():
    return app.send_static_file("marker.js")


if __name__ == "__main__":
    app.run(debug=True)

    