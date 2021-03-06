var projec = window.location.hash.replace(/#/g, '');
var project = projec.replace(/\./g, '-').replace(/\//g, '-');
var editor;
var firebase;

function init() {
    save_code();
    projec = window.location.hash.replace(/#/g, '');
    project = projec.replace(/\./g, '-').replace(/\//g, '-');
    $("#editor").html("");
    setup_editor();
    setup_stuff();
}

function save_code() {
    firebase.child("code").child(project).child("text").set(editor.getSession().getValue());
}

function setup_editor() {
    firebase = new Firebase("https://dep10y.firebaseio.com/");
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/python");
    var firepad = Firepad.fromACE(firebase.child("code").child(project), editor, {
        defaultText: ''
    });
    $(window).bind('beforeunload', function() {
        save_code();
    });
}

function setup_stuff() {
    var shreks = projec.split(":");
    firebase.child("code").child(project).update({user: shreks[0], projectid: shreks[1], filepath: shreks[2]});
    var shrek2 = shreks[2].split(".");
    var shrek = shrek2[shrek2.length - 1];
    window.shreks = shreks;
    editor.getSession().setMode("ace/mode/" + {py: "python", html: "html"}[shrek]);
    $("#filename").html(shreks[2]);
    firebase.child("projects").child(shreks[0]).child(shreks[1]).child("name").on("value", function(q) {
        $("#projectname").html(q.val());
    });
    construct_things(shreks[1]);
}

function push_that_button() {
    save_code();
    firebase.child("code").once("value", function(v) {
        forreal = []
        v.forEach(function(x) {
            console.log(window.shreks);
            console.log(x.val());
            if(x.val().projectid == window.shreks[1]) {
                forreal.push(x.val());
            }
        });
        forreal.forEach(function(x) {
            firebase.child("files").child(window.shreks[1]).push({
                filepath: x.filepath,
                text: x.text
            });
        });
    });
}
