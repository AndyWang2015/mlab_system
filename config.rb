require 'compass/import-once/activate'
# Require any additional compass plugins here.

# Set this to the root of your project when deployed:
http_path = "/"
css_dir = "css"
sass_dir = "scss"
images_dir = "images"
javascripts_dir = "js"

# You can select your preferred output style here (can be overridden via the command line):
# output_style = :expanded(預設展開) or :nested(巢狀) or :compact(單行) or :compressed(壓縮)
output_style = :expanded

# To enable relative paths to assets via compass helper functions. Uncomment:(圖片是否相對位置)
relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:(是否打開註解)
line_comments = false

# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass

Encoding.default_external = "utf-8"
sourcemap = true