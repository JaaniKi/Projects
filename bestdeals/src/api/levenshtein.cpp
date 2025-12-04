#include <QString>
#include <QRegularExpression>
#include <QVector>

// Normalize game names to make Levenshtein distance function more accurate
QString normalize(const QString& input) {
    QString s = input.toLower();

    // 2. Pad string with spaces to help Roman numeral matching
    s = " " + s + " ";

    // 3. Replace Roman numerals (I–XXVI) with Arabic digits
    QMap<QString, QString> romans = {
        {" xxvi", " 26"}, {" xxv", " 25"}, {" xxiv", " 24"}, {" xxiii", " 23"},
        {" xxii", " 22"}, {" xxi", " 21"}, {" xx", " 20"}, {" xix", " 19"},
        {" xviii", " 18"}, {" xvii", " 17"}, {" xvi", " 16"}, {" xv", " 15"},
        {" xiv", " 14"}, {" xiii", " 13"}, {" xii", " 12"}, {" xi", " 11"},
        {" x", " 10"}, {" ix", " 9"}, {" viii", " 8"}, {" vii", " 7"},
        {" vi", " 6"}, {" v", " 5"}, {" iv", " 4"}, {" iii", " 3"},
        {" ii", " 2"}, {" i", " 1"}
    };

    for (auto it = romans.begin(); it != romans.end(); ++it) {
        int pos;
        while ((pos = s.indexOf(it.key())) != -1) {
            s.replace(pos, it.key().size(), it.value());
        }
    }

    // 4. Remove punctuation/symbols (keep letters, numbers, spaces)
    QString cleaned;
    for (QChar c : s) {
        if (c.isLetterOrNumber() || c == ' ')
            cleaned.append(c);
    }
    s = cleaned;

    // 5. Remove filler/edition words
    QRegularExpression filler(
        "(game of the year|goty|edition|definitive|remastered|complete|collection|ultimate|"
        "anniversary|deluxe|enhanced|hd|redux|reloaded|gold|platinum|bundle|"
        "trilogy|remake|reboot|director.?s cut|expansion|package)"
    );
    s.replace(filler, "");

    // 6. Collapse multiple spaces into one
    s = s.simplified();

    // 7. Trim leading/trailing spaces
    s = s.trimmed();

    return s;
}

/* Algorithm for measuring how different two strings are, based on the minimum
 * number of single-character edits needed to turn one string into the other.
 * Strings a and b need to be normalized before calling this function. */
int levenshtein(const QString& a, const QString& b) {
    const int lenA = a.size();
    const int lenB = b.size();

    QVector<QVector<int>> dp(lenA + 1, QVector<int>(lenB + 1));

    for (int i = 0; i <= lenA; ++i) dp[i][0] = i;
    for (int j = 0; j <= lenB; ++j) dp[0][j] = j;

    for (int i = 1; i <= lenA; ++i) {
        for (int j = 1; j <= lenB; ++j) {
            int cost = (a[i - 1] == b[j - 1]) ? 0 : 1;
            dp[i][j] = std::min({
                dp[i - 1][j] + 1,     // deletion
                dp[i][j - 1] + 1,     // insertion
                dp[i - 1][j - 1] + cost // substitution
                });
        }
    }
    return dp[lenA][lenB];
}
