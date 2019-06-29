from flask import Flask, render_template

application = Flask(__name__)

@application.route("/")
@application.route('/index')
def index():
    return render_template("index.html")

@application.route("/cv")
def cv():
    page_name = 'cv'
    return render_template("cv.html", page_name=page_name)

@application.route("/matrix")
def matrix():
    page_name = 'cv'
    return render_template("matrix.html", page_name=page_name)

@application.route("/new")
def new():
    return render_template("new.html")

if __name__ == "__main__":
    application.run(debug=True)
