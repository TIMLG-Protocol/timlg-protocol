Apply prev/next footer navigation across the site.

1) Replace mkdocs.yml with the version in this patch (fixes an accidental '...' YAML terminator and enables navigation.footer).
2) Add docs/javascripts/footer-nav.js (renames labels to Back/Next).

Material will automatically hide Back on the first page and Next on the last page, and will follow your nav order.
