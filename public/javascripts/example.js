/*
 *
 *
 */

// CommentBox
var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({ data: data });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return { data: [] };
  },
  handleCommentSubmit: function(cmt) {
//    var comments = this.state.data;
//    var newComments = comments.concat([cmt]);
//    this.setState({ data: newComments });

    // submit to the server and refresh the list
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: cmt,
      success: function(data) {
        this.setState({ data: data });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={ this.state.data } />
        <CommentForm onCommentSubmit={ this.handleCommentSubmit } />
      </div>
    );
  }
});

// CommentList
var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(cmt) {
      return (
        <Comment key={ cmt.id } author={ cmt.author }>
          { cmt.text }
        </Comment>
      );
    });
  
    return (
      <div className="commentList">
        { commentNodes }
      </div>
    );
  }
});

// CommentForm
var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();

    var author = this.refs.author.value.trim();
    var text = this.refs.text.value.trim();

    if(!text || !author) {
      return;
    }

    // send request to the server
    this.props.onCommentSubmit({ author: author, text: text });

    this.refs.author.value = '';
    this.refs.text.value = '';

    return;
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={ this.handleSubmit }>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

// Comment
var Comment = React.createClass({
  render: function() {
    var rawMarkup = marked(this.props.children.toString(), { sanitize: true });

    return (
      <div className="comment">
        <h2 className="commentAuthor">
          { this.props.author }
        </h2>
        <span dangerouslySetInnerHTML={{ __html: rawMarkup }} />
      </div>
    );
  }
});

// DOM
ReactDOM.render(
  <CommentBox url="/api/comments" pollInterval={ 2000 } />,
  document.getElementById('content')
);

