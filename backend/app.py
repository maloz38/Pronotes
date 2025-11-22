from flask import Flask, request, jsonify
from flask_cors import CORS
import pronotepy
from pronotepy.ent import ent_auvergnerhonealpe

app = Flask(__name__)
CORS(app)

@app.route('/api/notes', methods=['POST'])
def get_notes():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Missing credentials"}), 400

    try:
        # URL for Branly (from original code)
        # Note: pronotepy usually detects the specific server URL if you give it the main index-education url,
        # or we can pass the specific one.
        # The original code had: "https://0690128P.index-education.net/pronote/eleve.html"
        url = "https://0690128P.index-education.net/pronote/eleve.html"

        client = pronotepy.Client(url, username=username, password=password, ent=ent_auvergnerhonealpe)

        if not client.logged_in:
             return jsonify({"error": "Login failed"}), 401

        grades = []
        for grade in client.current_period.grades:
            grades.append({
                "subject": grade.subject.name,
                "date": grade.date.isoformat(),
                "grade": grade.grade,
                "out_of": grade.out_of,
                "default_out_of": grade.default_out_of,
                "coefficient": grade.coefficient,
                "average": grade.average,
                "max": grade.max,
                "min": grade.min,
                "comment": grade.comment
            })

        # Calculate generic average
        total_points = 0
        total_coeffs = 0

        for g in grades:
            # Parse grade value (handle non-numeric grades like 'Absent', 'NonNote')
            try:
                # pronotepy returns value like "15,5" or "15.5" usually as string or specialized object
                # grade.grade is a string in pronotepy usually like "15,5/20" or just "15,5" depending on version
                # actually grade.grade is a Grade object or string. Let's be careful.
                # Looking at pronotepy docs/source, grade.grade is a string.

                val_str = g["grade"].replace(',', '.')
                if not val_str[0].isdigit():
                    continue # Skip non-numeric

                value = float(val_str)
                coeff = float(g["coefficient"])

                # Normalize to /20 if needed? Usually average is calculated on weighted raw scores.
                # But simple average: (value / out_of) * 20 * coeff

                out_of = float(g["out_of"].replace(',', '.'))
                normalized_value = (value / out_of) * 20

                total_points += normalized_value * coeff
                total_coeffs += coeff
            except Exception as e:
                print(f"Error parsing grade: {g}: {e}")
                continue

        overall_average = -1
        if total_coeffs > 0:
            overall_average = round(total_points / total_coeffs, 2)

        return jsonify({
            "grades": grades,
            "average": overall_average,
            "user": client.info.name
        })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001)
