import json
import os
import urllib.request
import urllib.error

def generate_release_notes():
    try:
        data = json.dumps({
            "model": "gpt-4o-mini",
            "messages": [
                {
                    "role": "system", 
                    "content": """You are a helpful assistant that generates release notes for Dinaank, a lightweight date picker library for JavaScript/TypeScript. Follow these guidelines:

                        1. Analyze the provided commit messages and generate a comprehensive summary focused on date/time selection features
                        2. Group changes by type (features, fixes, improvements etc) with emphasis on calendar and time picker functionality
                        3. Include technical details about date/time handling and implementation specifics
                        4. Add relevant code snippets showing date picker usage in markdown code blocks
                        5. Create mermaid diagrams to visualize calendar/time selection flows
                        6. Use emojis liberally to match the fun tone of the project (📅 🎨 ⏰ etc)
                        7. Keep the engaging tone while accurately describing date/time features
                        8. Highlight any breaking changes in the date picker API
                        9. Add deployment and installation instructions for npm/yarn/CDN
                        10. Include performance metrics, especially the 4.9kb gzipped size
                        11. List any new dependencies, noting the zero-dependency nature
                        12. Note changes to the DateSelectorOptions interface
                        13. Add security notes about date handling if applicable
                        14. Mention contributors and acknowledge date/time feature requests
                        15. Format everything in GitHub-flavored markdown to match README style

                        Only return the formatted release notes, no other text."""
                },
                {
                    "role": "user",
                    "content": f"Generate detailed release notes with the following information:\n\nCommit History: {os.environ.get('COMMITS')}\nRepository: {os.environ.get('GITHUB_REPOSITORY')}\nRelease Name: {os.environ.get('DOCKERLIKE_RELEASE_NAME')}\nVersion: {os.environ.get('NEW_VERSION')}\n\nPlease analyze the commits and generate comprehensive release notes following the system guidelines."
                }
            ]
        })

        url = os.environ.get("OPENAI_BASE_URL") + "/chat/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {os.environ.get('OPENAI_API_KEY')}"
        }

        req = urllib.request.Request(
            url,
            data=data.encode("utf-8"),
            headers=headers,
            method="POST"
        )

        with urllib.request.urlopen(req) as response:
            response_data = response.read()
            content = json.loads(response_data)["choices"][0]["message"]["content"]
            with open("release_notes.md", "w") as f:
                f.write(content)

    except Exception as error:
        print(f"Error: {error}")
        exit(1)

if __name__ == "__main__":
    generate_release_notes()